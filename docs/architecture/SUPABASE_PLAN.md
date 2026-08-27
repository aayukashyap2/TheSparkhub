# Supabase Plan

Target Supabase project:

- Name: The SparkHub
- Project ref: `gvebffgbexucyspjhsau`
- Region: `ap-southeast-1`
- Postgres: 17

## Current Boundary

Phase 2 has modified the live database through checked Supabase migrations.

Applied migrations:

- `20260827163451_core_schema_security_foundation.sql`
- `20260827163928_add_missing_foreign_key_indexes.sql`

Verified live state on 2026-08-27:

- 26 public application tables.
- 26 public tables with RLS enabled.
- 72 public table policies.
- 16 storage object policies.
- 4 storage buckets.
- No security advisor lints.
- Foreign-key covering indexes are in place.
- Remaining performance advisor notes are unused-index observations on a new database and RLS policy consolidation opportunities.

## Auth

Use Supabase Auth for:

- Email/password
- Google OAuth
- Password reset
- Session persistence through SSR-safe cookies

GitHub OAuth can be enabled later after the production homepage URL exists.

## Data API Note

Supabase has changed how new tables can be exposed to the Data API. Phase 2 must not assume that newly created tables are automatically reachable by `anon` or `authenticated`. Where client access is required, migrations should pair explicit grants with RLS policies.

## Security Principles

- Enable RLS on every table in exposed schemas.
- Never use user-editable metadata as an authorization source.
- Never expose service role keys in frontend code.
- Use ownership predicates for user-owned records.
- Use connection-aware policies for private profile, messaging, and investment-related data.
- Use explicit visibility fields for financial and portfolio information.

## Initial Storage Buckets

Created buckets:

- `avatars`
- `idea-media`
- `portfolio-media`
- `documents`

Each bucket needs file size, file type, ownership, and visibility policies.

These buckets have file-size, MIME-type, ownership, and visibility policies in the Phase 2 migrations.

## Investment Data Boundary

Investment discovery is intentionally modeled as separate business entities:

```text
Idea Poster -> Idea -> Investment Interest -> Connection -> Investment
```

`investment_interests` and `investments` are separate tables. Creating an interest records a signal from an investor; it does not create or imply an investment. Anonymous users cannot read either table.
