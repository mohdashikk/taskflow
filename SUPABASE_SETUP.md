# Supabase changes for the TaskFlow workspace

The existing project, status, and task flows work with the three tables already shown in your Supabase schema. No migration is required to fetch those records.

Run `supabase/migrations/202609140001_taskflow_workspace.sql` only when you want persistent milestones and documents.

It adds:

- Optional repository and production URL fields on `projects`.
- `project_milestones` for the delivery plan.
- `project_documents` for project documentation.
- Row-level security policies that restrict milestone and document rows to their authenticated owner.
- Indexes and authenticated-role grants for both new tables.

No new environment variables are required. Keep the existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` values.

The current Team step is intentionally informational. To support real invitations later, add a `project_members` table rather than storing member IDs directly on `projects`.
