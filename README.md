# Notes & Paws

A personal and pet-care dashboard for tracking Vikash's tasks and Mishti's health, grooming, shopping, and events.

## Current Status

This version is wired to the live Supabase project `NotesAndPaws`. Public visitors can view shared data, while editing is reserved for authenticated admin users.

Supabase backend schema is being prepared under `supabase/` for:

- Admin-only editing
- Public read-only sharing
- Database-backed task and pet-care data
- Private medical record storage

## Local Preview

```bash
python3 -m http.server 8001 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8001
```


## Live Backend

Supabase project ref: `jnqolhzluloqsehvfdqx`

The live database migration has been pushed. After your first magic-link login, add your Supabase Auth user as admin with:

```sql
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'YOUR_EMAIL_HERE';
```

## Publishing

This repo is ready for GitHub Pages from the `main` branch root.
