-- ============================================================
-- LUNA — Stockage des visuels du calendrier éditorial
-- À exécuter dans Supabase → SQL Editor (une seule fois).
-- Crée le bucket "content" (public) + droits : écriture admin,
-- lecture publique (pour afficher les vignettes dans /admin).
-- ============================================================

-- 1) Bucket public "content"
insert into storage.buckets (id, name, public)
values ('content', 'content', true)
on conflict (id) do nothing;

-- 2) Envoi / remplacement / suppression réservés à l'admin
drop policy if exists "content_admin_insert" on storage.objects;
create policy "content_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'content' and auth.jwt() ->> 'email' = 'mhcreative.ideas@gmail.com');

drop policy if exists "content_admin_update" on storage.objects;
create policy "content_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'content' and auth.jwt() ->> 'email' = 'mhcreative.ideas@gmail.com');

drop policy if exists "content_admin_delete" on storage.objects;
create policy "content_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'content' and auth.jwt() ->> 'email' = 'mhcreative.ideas@gmail.com');

-- 3) Lecture publique (afficher les vignettes)
drop policy if exists "content_public_read" on storage.objects;
create policy "content_public_read" on storage.objects
  for select using (bucket_id = 'content');
