# Notes & Paws Supabase Backend

This folder contains the database migration for the Notes & Paws backend.

## What It Creates

- Admin user table
- Share settings
- Personal task tables
- Mishti pet profile, health, grooming, shopping, events, and medical record tables
- Private Supabase Storage bucket for medical records
- Row Level Security policies

## Permission Model

- Admin users can add, edit, delete, upload, and manage data.
- Public/view-only users can only read rows where `is_public = true`.
- Medical record files are private by default.
- Sensitive task fields can be hidden through `share_settings.hide_sensitive_fields`.

## Admin Bootstrap

After you create your first Supabase Auth user, run this in the Supabase SQL editor:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'YOUR_EMAIL_HERE';
```

Replace `YOUR_EMAIL_HERE` with your login email.

## Applying Later

Once the Supabase CLI is linked to the `Notesandpaws` project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

