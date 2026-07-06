-- ============================================================
-- LUNA — Stockage du jeton Instagram (pour renouvellement auto)
-- À exécuter dans Supabase → SQL Editor (une seule fois).
-- La clé d'accès Instagram vit désormais ici (au lieu de Vercel),
-- pour qu'un robot puisse la rafraîchir tout seul tous les ~45 jours.
-- RLS activé sans policy = personne n'y accède, SAUF le rôle "service"
-- (utilisé uniquement par les fonctions serveur). Aucune fuite possible.
-- ============================================================

create table if not exists public.meta_tokens (
  id           text primary key,
  access_token text not null,
  updated_at   timestamptz not null default now()
);

alter table public.meta_tokens enable row level security;
-- (Pas de policy volontairement : seul le rôle service peut lire/écrire.)
