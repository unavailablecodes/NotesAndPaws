-- Public visitors should read the sanitized public_tasks view, not raw task rows.
drop policy if exists "Public can read visible tasks" on public.tasks;

grant select on public.public_tasks to anon, authenticated;
