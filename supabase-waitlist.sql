-- ============================================================
-- LUNA — Table "liste d'attente" (vitrine web)
-- ============================================================
-- À coller dans Supabase → SQL Editor → New query → Run.
-- Crée la table qui stocke les emails récupérés sur la vitrine.
-- Sécurité (RLS) : n'importe quelle visiteuse peut s'inscrire,
-- mais SEULE l'admin (toi) peut lire/supprimer la liste.
-- ============================================================

create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,          -- un email ne peut s'inscrire qu'une fois
  source     text,                          -- d'où vient l'inscription (hero, cta-final…)
  created_at timestamptz not null default now()
);

-- Active la sécurité au niveau des lignes
alter table public.waitlist enable row level security;

-- 1) Inscription publique : toute visiteuse (même non connectée) peut s'ajouter
drop policy if exists "waitlist_insert_public" on public.waitlist;
create policy "waitlist_insert_public"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

-- 2) Lecture réservée à l'admin
drop policy if exists "waitlist_select_admin" on public.waitlist;
create policy "waitlist_select_admin"
  on public.waitlist for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'mhcreative.ideas@gmail.com');

-- 3) Suppression réservée à l'admin
drop policy if exists "waitlist_delete_admin" on public.waitlist;
create policy "waitlist_delete_admin"
  on public.waitlist for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'mhcreative.ideas@gmail.com');
