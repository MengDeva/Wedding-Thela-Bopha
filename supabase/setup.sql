-- ============================================================
-- Run this once in Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1) Guest wishes table
create table if not exists public.wishes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 100),
  message     text not null check (char_length(message) between 1 and 500),
  attending   text not null default '' check (attending in ('', 'yes', 'no', 'maybe')),
  ip_hash     text,
  created_at  timestamptz not null default now()
);

create index if not exists wishes_created_at_idx on public.wishes (created_at desc);
create index if not exists wishes_ip_hash_idx on public.wishes (ip_hash, created_at desc);

-- Row Level Security ON with no policies = nobody can read/write with the public key.
-- Only the website's server (using the secret key) can access the table.
alter table public.wishes enable row level security;

-- 2) Public storage bucket for photos, cover, music and KHQR images
--    Folders inside it:  gallery/   cover/   music/   khqr/
insert into storage.buckets (id, name, public)
values ('invitation', 'invitation', true)
on conflict (id) do update set public = true;
