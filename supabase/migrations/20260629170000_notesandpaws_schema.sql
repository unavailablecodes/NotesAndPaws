-- Notes & Paws Supabase schema
-- Admin users can add/edit/delete. Public viewers can only read rows marked public.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.share_settings (
  id boolean primary key default true,
  dashboard_name text not null default 'Notes & Paws',
  public_read_enabled boolean not null default true,
  hide_sensitive_fields boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint share_settings_singleton check (id)
);

insert into public.share_settings (id)
values (true)
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create or replace function public.public_read_enabled()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select public_read_enabled from public.share_settings where id = true), false);
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_date date not null default current_date,
  priority text not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  workstream text not null default 'Personal' check (workstream in ('Personal', 'Family', 'Work')),
  location_type text not null default 'Current City' check (location_type in ('Current City', 'Village', 'Other')),
  next_followup_date date,
  in_touch_with text,
  last_followup_via text default 'Not Done' check (last_followup_via in ('Call', 'Message', 'Email', 'Not Done')),
  point_of_contact text,
  govt_involved boolean not null default false,
  department_name text,
  website_link text,
  ticket_number text,
  official_contact text,
  notes text,
  status text not null default 'Open' check (status in ('Open', 'Done')),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  breed text,
  notes text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_health (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  last_deworming date,
  next_health_checkup date,
  last_checkup_date date,
  doctor_name text,
  hospital_name text,
  notes text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_grooming (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  grooming_date date not null,
  groomer_name text,
  location_name text,
  notes text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_shopping (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  shopping_date date not null,
  category text not null default 'Misc' check (category in ('Toys', 'Treats', 'Misc')),
  items text,
  notes text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_events (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  name text not null,
  type text not null default 'Other' check (type in ('Vet Visit', 'Grooming', 'Shopping', 'Playdate', 'Training', 'Travel', 'Other')),
  status text not null default 'Upcoming' check (status in ('Upcoming', 'Attended')),
  event_date date not null,
  location text,
  with_whom text,
  notes text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.medical_records (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  display_name text not null,
  storage_path text not null,
  mime_type text,
  file_size bigint,
  record_date date,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_next_followup_idx on public.tasks (next_followup_date);
create index if not exists tasks_workstream_idx on public.tasks (workstream);
create index if not exists pet_events_date_idx on public.pet_events (event_date);
create index if not exists pet_events_status_idx on public.pet_events (status);
create index if not exists pet_grooming_date_idx on public.pet_grooming (grooming_date);
create index if not exists pet_shopping_date_idx on public.pet_shopping (shopping_date);

create or replace view public.public_tasks as
select
  id,
  title,
  created_date,
  priority,
  workstream,
  location_type,
  next_followup_date,
  case when (select hide_sensitive_fields from public.share_settings where id = true) then null else in_touch_with end as in_touch_with,
  last_followup_via,
  case when (select hide_sensitive_fields from public.share_settings where id = true) then null else point_of_contact end as point_of_contact,
  govt_involved,
  department_name,
  website_link,
  case when (select hide_sensitive_fields from public.share_settings where id = true) then null else ticket_number end as ticket_number,
  case when (select hide_sensitive_fields from public.share_settings where id = true) then null else official_contact end as official_contact,
  notes,
  status,
  created_at,
  updated_at
from public.tasks
where is_public = true and public.public_read_enabled();

create trigger tasks_touch_updated_at
before update on public.tasks
for each row execute function public.touch_updated_at();

create trigger pets_touch_updated_at
before update on public.pets
for each row execute function public.touch_updated_at();

create trigger pet_health_touch_updated_at
before update on public.pet_health
for each row execute function public.touch_updated_at();

create trigger pet_grooming_touch_updated_at
before update on public.pet_grooming
for each row execute function public.touch_updated_at();

create trigger pet_shopping_touch_updated_at
before update on public.pet_shopping
for each row execute function public.touch_updated_at();

create trigger pet_events_touch_updated_at
before update on public.pet_events
for each row execute function public.touch_updated_at();

create trigger medical_records_touch_updated_at
before update on public.medical_records
for each row execute function public.touch_updated_at();

alter table public.admin_users enable row level security;
alter table public.share_settings enable row level security;
alter table public.tasks enable row level security;
alter table public.pets enable row level security;
alter table public.pet_health enable row level security;
alter table public.pet_grooming enable row level security;
alter table public.pet_shopping enable row level security;
alter table public.pet_events enable row level security;
alter table public.medical_records enable row level security;

create policy "Admins can read admin users"
on public.admin_users for select
using (public.is_admin());

create policy "Admins can manage share settings"
on public.share_settings for all
using (public.is_admin())
with check (public.is_admin());

create policy "Anyone can read share settings"
on public.share_settings for select
using (true);

create policy "Admins can manage tasks"
on public.tasks for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read visible tasks"
on public.tasks for select
using (public.public_read_enabled() and is_public = true);

create policy "Admins can manage pets"
on public.pets for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read visible pets"
on public.pets for select
using (public.public_read_enabled() and is_public = true);

create policy "Admins can manage pet health"
on public.pet_health for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read visible pet health"
on public.pet_health for select
using (public.public_read_enabled() and is_public = true);

create policy "Admins can manage pet grooming"
on public.pet_grooming for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read visible pet grooming"
on public.pet_grooming for select
using (public.public_read_enabled() and is_public = true);

create policy "Admins can manage pet shopping"
on public.pet_shopping for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read visible pet shopping"
on public.pet_shopping for select
using (public.public_read_enabled() and is_public = true);

create policy "Admins can manage pet events"
on public.pet_events for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read visible pet events"
on public.pet_events for select
using (public.public_read_enabled() and is_public = true);

create policy "Admins can manage medical records"
on public.medical_records for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read visible medical record metadata"
on public.medical_records for select
using (public.public_read_enabled() and is_public = true);

insert into storage.buckets (id, name, public)
values ('medical-records', 'medical-records', false)
on conflict (id) do nothing;

create policy "Admins can upload medical records"
on storage.objects for insert
with check (bucket_id = 'medical-records' and public.is_admin());

create policy "Admins can read medical records"
on storage.objects for select
using (bucket_id = 'medical-records' and public.is_admin());

create policy "Admins can update medical records"
on storage.objects for update
using (bucket_id = 'medical-records' and public.is_admin())
with check (bucket_id = 'medical-records' and public.is_admin());

create policy "Admins can delete medical records"
on storage.objects for delete
using (bucket_id = 'medical-records' and public.is_admin());

-- After your first Supabase Auth login, run this once in SQL editor:
-- insert into public.admin_users (user_id, email)
-- select id, email from auth.users where email = 'YOUR_EMAIL_HERE';
