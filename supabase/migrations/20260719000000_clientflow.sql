-- ClientFlow production schema. Apply with: supabase db push
create extension if not exists pgcrypto;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  created_at timestamptz not null default now()
);

create table public.memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'member', 'client')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  company text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  name text not null check (char_length(name) between 3 and 120),
  summary text not null default '',
  status text not null default 'Planning' check (status in ('Planning', 'In progress', 'Review', 'Complete')),
  due_date date,
  budget numeric(12, 2) not null default 0 check (budget >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  label text not null,
  due_date date,
  complete boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  title text not null check (char_length(title) between 3 and 120),
  detail text not null,
  status text not null default 'New' check (status in ('New', 'In review', 'Approved', 'Done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  name text not null,
  category text not null default 'General',
  storage_path text not null,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  created_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  number text not null,
  amount numeric(12, 2) not null check (amount > 0),
  due_date date not null,
  status text not null default 'Draft' check (status in ('Draft', 'Sent', 'Paid')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, number)
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  message text not null,
  detail text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index projects_organization_idx on public.projects (organization_id);
create index projects_client_idx on public.projects (client_id);
create index milestones_project_idx on public.milestones (project_id);
create index requests_project_idx on public.requests (project_id);
create index documents_project_idx on public.documents (project_id);
create index invoices_project_idx on public.invoices (project_id);
create index activity_project_created_idx on public.activity_events (project_id, created_at desc);

create or replace function public.user_organization_ids()
returns setof uuid language sql stable security definer set search_path = public
as $$ select organization_id from public.memberships where user_id = auth.uid(); $$;

revoke all on function public.user_organization_ids() from public;
grant execute on function public.user_organization_ids() to authenticated;

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.milestones enable row level security;
alter table public.requests enable row level security;
alter table public.documents enable row level security;
alter table public.invoices enable row level security;
alter table public.activity_events enable row level security;

create policy "Members read organizations" on public.organizations for select to authenticated
using (id in (select public.user_organization_ids()));
create policy "Members read memberships" on public.memberships for select to authenticated
using (organization_id in (select public.user_organization_ids()));

create policy "Members read clients" on public.clients for select to authenticated
using (organization_id in (select public.user_organization_ids()));
create policy "Owners manage clients" on public.clients for all to authenticated
using (exists (select 1 from public.memberships m where m.organization_id = clients.organization_id and m.user_id = auth.uid() and m.role in ('owner', 'member')))
with check (exists (select 1 from public.memberships m where m.organization_id = clients.organization_id and m.user_id = auth.uid() and m.role in ('owner', 'member')));

create policy "Members read projects" on public.projects for select to authenticated
using (organization_id in (select public.user_organization_ids()));
create policy "Owners manage projects" on public.projects for all to authenticated
using (exists (select 1 from public.memberships m where m.organization_id = projects.organization_id and m.user_id = auth.uid() and m.role in ('owner', 'member')))
with check (exists (select 1 from public.memberships m where m.organization_id = projects.organization_id and m.user_id = auth.uid() and m.role in ('owner', 'member')));

create policy "Members read milestones" on public.milestones for select to authenticated
using (organization_id in (select public.user_organization_ids()));
create policy "Owners manage milestones" on public.milestones for all to authenticated
using (exists (select 1 from public.memberships m where m.organization_id = milestones.organization_id and m.user_id = auth.uid() and m.role in ('owner', 'member')))
with check (exists (select 1 from public.memberships m where m.organization_id = milestones.organization_id and m.user_id = auth.uid() and m.role in ('owner', 'member')));

create policy "Members read requests" on public.requests for select to authenticated
using (organization_id in (select public.user_organization_ids()));
create policy "Members create requests" on public.requests for insert to authenticated
with check (organization_id in (select public.user_organization_ids()));
create policy "Owners update requests" on public.requests for update to authenticated
using (exists (select 1 from public.memberships m where m.organization_id = requests.organization_id and m.user_id = auth.uid() and m.role in ('owner', 'member')));

create policy "Members read documents" on public.documents for select to authenticated
using (organization_id in (select public.user_organization_ids()));
create policy "Members create documents" on public.documents for insert to authenticated
with check (organization_id in (select public.user_organization_ids()));

create policy "Members read invoices" on public.invoices for select to authenticated
using (organization_id in (select public.user_organization_ids()));
create policy "Owners manage invoices" on public.invoices for all to authenticated
using (exists (select 1 from public.memberships m where m.organization_id = invoices.organization_id and m.user_id = auth.uid() and m.role in ('owner', 'member')))
with check (exists (select 1 from public.memberships m where m.organization_id = invoices.organization_id and m.user_id = auth.uid() and m.role in ('owner', 'member')));

create policy "Members read activity" on public.activity_events for select to authenticated
using (organization_id in (select public.user_organization_ids()));
create policy "Members create activity" on public.activity_events for insert to authenticated
with check (organization_id in (select public.user_organization_ids()));
