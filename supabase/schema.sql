-- FlowForge – Workflow Builder Lite
-- Run this in Supabase SQL Editor to create tables.

-- Workflows: name + ordered steps (json array of step ids)
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Runs: one per workflow execution
create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  input_text text not null default '',
  step_outputs jsonb not null default '[]'::jsonb,
  final_output text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists runs_workflow_id_idx on public.runs(workflow_id);
create index if not exists runs_created_at_idx on public.runs(created_at desc);

-- Allow anonymous read/write for demo (restrict in production with RLS)
alter table public.workflows enable row level security;
alter table public.runs enable row level security;

create policy "Allow all on workflows" on public.workflows for all using (true) with check (true);
create policy "Allow all on runs" on public.runs for all using (true) with check (true);
