-- Expanded private share payload for scoped dashboard links.
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
    'pet_health', case when link.scope in ('all', 'pet') then coalesce((
      select jsonb_agg(to_jsonb(h))
      from public.pet_health h
      join public.pets p on p.id = h.pet_id
      where p.owner_id = link.owner_id
        and h.is_public = true
        and (link.pet_id is null or h.pet_id = link.pet_id)
    ), '[]'::jsonb) else '[]'::jsonb end,
    'pet_grooming', case when link.scope in ('all', 'pet') then coalesce((
      select jsonb_agg(to_jsonb(g))
      from public.pet_grooming g
      join public.pets p on p.id = g.pet_id
      where p.owner_id = link.owner_id
        and g.is_public = true
        and (link.pet_id is null or g.pet_id = link.pet_id)
    ), '[]'::jsonb) else '[]'::jsonb end,
    'pet_shopping', case when link.scope in ('all', 'pet') then coalesce((
      select jsonb_agg(to_jsonb(s))
      from public.pet_shopping s
      join public.pets p on p.id = s.pet_id
      where p.owner_id = link.owner_id
        and s.is_public = true
        and (link.pet_id is null or s.pet_id = link.pet_id)
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
