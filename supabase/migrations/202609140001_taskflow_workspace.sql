-- TaskFlow workspace additions. Run this in the Supabase SQL editor.
create extension if not exists "pgcrypto";

alter table public.projects
  add column if not exists start_date date,
  add column if not exists repository_url text,
  add column if not exists production_url text;

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  description text,
  due_date date,
  status text not null default 'upcoming' check (status in ('upcoming','in_progress','completed')),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_milestones_project_idx on public.project_milestones(project_id, position);
create index if not exists project_documents_project_idx on public.project_documents(project_id, updated_at desc);

alter table public.project_milestones enable row level security;
alter table public.project_documents enable row level security;

drop policy if exists "milestones_owner_all" on public.project_milestones;
create policy "milestones_owner_all" on public.project_milestones
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "documents_owner_all" on public.project_documents;
create policy "documents_owner_all" on public.project_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Ensure project owners can use the new fields. Existing project RLS policies remain unchanged.
grant select, insert, update, delete on public.project_milestones to authenticated;
grant select, insert, update, delete on public.project_documents to authenticated;
