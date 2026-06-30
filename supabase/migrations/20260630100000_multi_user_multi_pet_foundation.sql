-- Multi-user, multi-pet, and controlled sharing foundation for Notes & Paws.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  public_slug text unique,
  role text not null default 'user' check (role in ('user', 'master_admin')),
  share_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  scope text not null default 'all' check (scope in ('all', 'personal', 'pet')),
  pet_id uuid references public.pets(id) on delete cascade,
  label text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.tasks add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.pets add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.pets add column if not exists species text not null default 'Dog' check (species in ('Dog', 'Cat', 'Other'));
alter table public.pets add column if not exists birthdate date;
alter table public.pets add column if not exists photo_url text;

insert into public.profiles (user_id, email, display_name, public_slug, role, share_enabled)
select au.user_id, coalesce(au.email, u.email), 'Vikash', 'vikash', 'master_admin', false
from public.admin_users au
left join auth.users u on u.id = au.user_id
on conflict (user_id) do update set
  role = 'master_admin',
  email = excluded.email,
  display_name = coalesce(public.profiles.display_name, excluded.display_name),
  public_slug = coalesce(public.profiles.public_slug, excluded.public_slug),
  updated_at = now();

update public.tasks
set owner_id = coalesce(owner_id, (select user_id from public.admin_users limit 1));

update public.pets
set owner_id = coalesce(owner_id, (select user_id from public.admin_users limit 1));

create index if not exists profiles_slug_idx on public.profiles (public_slug);
create index if not exists tasks_owner_idx on public.tasks (owner_id);
create index if not exists pets_owner_idx on public.pets (owner_id);
create index if not exists share_links_token_idx on public.share_links (token);
create index if not exists share_links_owner_idx on public.share_links (owner_id);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid())
    or exists (select 1 from public.profiles where user_id = auth.uid() and role = 'master_admin');
$$;

create or replace function public.owns_pet(target_pet_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.pets
    where id = target_pet_id and owner_id = auth.uid()
  );
$$;

create or replace function public.share_payload(share_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  link public.share_links%rowtype;
begin
  select * into link
  from public.share_links
  where token = share_token
    and revoked_at is null
    and expires_at > now()
  limit 1;

  if not found then
    return jsonb_build_object('valid', false);
  end if;

  return jsonb_build_object(
    'valid', true,
    'scope', link.scope,
    'expires_at', link.expires_at,
    'tasks', case when link.scope in ('all', 'personal') then coalesce((
      select jsonb_agg(to_jsonb(t) - 'owner_id' - 'ticket_number' - 'official_contact')
      from public.tasks t
      where t.owner_id = link.owner_id and t.is_public = true
    ), '[]'::jsonb) else '[]'::jsonb end,
    'pets', case when link.scope in ('all', 'pet') then coalesce((
      select jsonb_agg(to_jsonb(p) - 'owner_id')
      from public.pets p
      where p.owner_id = link.owner_id
        and p.is_public = true
        and (link.pet_id is null or p.id = link.pet_id)
    ), '[]'::jsonb) else '[]'::jsonb end,
    'pet_events', case when link.scope in ('all', 'pet') then coalesce((
      select jsonb_agg(to_jsonb(e))
      from public.pet_events e
      join public.pets p on p.id = e.pet_id
      where p.owner_id = link.owner_id
        and e.is_public = true
        and (link.pet_id is null or e.pet_id = link.pet_id)
    ), '[]'::jsonb) else '[]'::jsonb end
  );
end;
$$;

grant execute on function public.share_payload(text) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.share_links enable row level security;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can manage own share links" on public.share_links;
create policy "Users can manage own share links"
on public.share_links for all
using (owner_id = auth.uid() or public.is_admin())
with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "Users can manage own tasks" on public.tasks;
create policy "Users can manage own tasks"
on public.tasks for all
using (owner_id = auth.uid() or public.is_admin())
with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "Users can manage own pets" on public.pets;
create policy "Users can manage own pets"
on public.pets for all
using (owner_id = auth.uid() or public.is_admin())
with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "Users can manage own pet health" on public.pet_health;
create policy "Users can manage own pet health"
on public.pet_health for all
using (public.owns_pet(pet_id) or public.is_admin())
with check (public.owns_pet(pet_id) or public.is_admin());

drop policy if exists "Users can manage own pet grooming" on public.pet_grooming;
create policy "Users can manage own pet grooming"
on public.pet_grooming for all
using (public.owns_pet(pet_id) or public.is_admin())
with check (public.owns_pet(pet_id) or public.is_admin());

drop policy if exists "Users can manage own pet shopping" on public.pet_shopping;
create policy "Users can manage own pet shopping"
on public.pet_shopping for all
using (public.owns_pet(pet_id) or public.is_admin())
with check (public.owns_pet(pet_id) or public.is_admin());

drop policy if exists "Users can manage own pet events" on public.pet_events;
create policy "Users can manage own pet events"
on public.pet_events for all
using ((pet_id is not null and public.owns_pet(pet_id)) or public.is_admin())
with check ((pet_id is not null and public.owns_pet(pet_id)) or public.is_admin());

drop policy if exists "Users can manage own medical records" on public.medical_records;
create policy "Users can manage own medical records"
on public.medical_records for all
using (public.owns_pet(pet_id) or public.is_admin())
with check (public.owns_pet(pet_id) or public.is_admin());
