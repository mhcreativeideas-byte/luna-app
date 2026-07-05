-- ============================================================
-- LUNA — Sécurité de la base (référence)
-- APPLIQUÉ dans Supabase le 2026-07-04 (SQL Editor, avec Margaux).
-- Ce fichier est la trace de ce qui tourne en production.
-- ============================================================
-- Contexte : l'audit du 2026-07-04 a révélé que la table users
-- était ouverte à tous (« Allow anonymous select/update/delete »
-- avec condition TRUE) et que delete_user_completely ne vérifiait
-- pas l'identité. Ce script a tout verrouillé.
-- ============================================================

-- ---------- 1) TABLE users ----------
-- Suppression des règles dangereuses d'origine
drop policy if exists "Allow anonymous insert" on public.users;
drop policy if exists "Allow anonymous select" on public.users;
drop policy if exists "Allow anonymous update" on public.users;
drop policy if exists "Allow delete for all" on public.users;

-- Chaque utilisatrice ne voit/modifie QUE sa propre ligne.
-- L'admin (email ci-dessous) garde la lecture globale pour les stats.
create policy "users_select_own"
  on public.users for select
  to authenticated
  using (auth.uid() = auth_id or (auth.jwt() ->> 'email') = 'mhcreative.ideas@gmail.com');

create policy "users_insert_own"
  on public.users for insert
  to authenticated
  with check (auth.uid() = auth_id);

create policy "users_update_own"
  on public.users for update
  to authenticated
  using (auth.uid() = auth_id)
  with check (auth.uid() = auth_id);

create policy "users_delete_own"
  on public.users for delete
  to authenticated
  using (auth.uid() = auth_id);

-- ---------- 2) TABLE user_tracking ----------
-- Règle existante conservée : "Users can manage own tracking"
-- (ALL, using auth.uid() = auth_id). Ajout de la lecture admin :
drop policy if exists "tracking_select_admin" on public.user_tracking;
create policy "tracking_select_admin"
  on public.user_tracking for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'mhcreative.ideas@gmail.com');

-- ---------- 3) Colonnes persona (admin) ----------
alter table public.users add column if not exists age text;
alter table public.users add column if not exists cravings jsonb default '[]'::jsonb;
alter table public.users add column if not exists barriers jsonb default '[]'::jsonb;
alter table public.users add column if not exists discovery_source text;

-- ---------- 4) Suppression de compte sécurisée ----------
-- SECURITY DEFINER (nécessaire pour supprimer dans auth.users),
-- MAIS avec garde-fou : on peut supprimer SON propre compte...
-- ...OU n'importe quel compte SI on est l'admin (pour l'espace /admin).
-- MàJ 2026-07-05 : ajout de l'exception admin (avant, l'admin ne
-- pouvait supprimer que son propre compte → suppression impossible
-- depuis /admin pour les utilisatrices).
-- Efface aussi le suivi (journal, règles…) → conformité RGPD.
create or replace function public.delete_user_completely(user_auth_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Suppression refusee : non authentifie.';
  end if;
  -- Autorisee si : (a) c'est ton propre compte, OU (b) tu es l'admin.
  if auth.uid() <> user_auth_id
     and coalesce(auth.jwt() ->> 'email', '') <> 'mhcreative.ideas@gmail.com' then
    raise exception 'Suppression refusee : ce compte ne t appartient pas.';
  end if;
  delete from public.user_tracking where auth_id = user_auth_id;
  delete from public.users where auth_id = user_auth_id;
  delete from auth.users where id = user_auth_id;
end;
$$;

-- ============================================================
-- Vérification (résultats attendus) :
--   select tablename, policyname, cmd from pg_policies
--   where schemaname='public' and tablename in ('users','user_tracking');
--   → users_select_own / users_insert_own / users_update_own /
--     users_delete_own / Users can manage own tracking / tracking_select_admin
--   colonnes_persona = 4 · fonction_securisee = true  ✓ (vérifié 2026-07-04)
-- ============================================================
