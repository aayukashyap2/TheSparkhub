# Supabase Plan

Target Supabase project:

- Name: The SparkHub
- Project ref: `gvebffgbexucyspjhsau`
- Region: `ap-southeast-1`
- Postgres: 17

## Current Boundary

Phase 1 does not modify the live database.

Phase 2 will add migrations and RLS after the model is reviewed.

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

Proposed buckets for Phase 2:

- `avatars`
- `idea-media`
- `portfolio-media`
- `documents`

Each bucket needs file size, file type, ownership, and visibility policies.
