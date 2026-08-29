# Auth and Onboarding Architecture

Phase 3 establishes identity and role foundations without completing every role workflow.

## Routes

- `/login`: email/password and Google sign-in entry.
- `/signup`: email/password and Google sign-up entry.
- `/auth/callback`: Supabase OAuth/code callback.
- `/auth/logout`: session sign-out.
- `/onboarding`: protected role selection and profile creation.
- `/app`: protected role router.
- `/app/idea-poster`: idea poster workspace shell.
- `/app/investor`: investor workspace shell.
- `/app/mentor`: mentor workspace shell.
- `/app/admin`: admin workspace shell.

## Role Boundary

Users can self-select:

- `idea_poster`
- `investor`
- `mentor`

Users cannot self-select `admin`. Admin access must be granted through a trusted database or operations process.

## Session Boundary

Supabase Auth owns authentication. SparkHub stores authorization and product role state in database records:

- `profiles`
- `profile_roles`
- `investor_profiles`
- `mentor_profiles`
- `user_preferences`

The UI reads these records and redirects users to the right workspace. RLS remains the data-level enforcement layer.

## Sentry Boundary

Sentry instrumentation files are present for client, server, edge, and request-error capture. They stay dormant unless `NEXT_PUBLIC_SENTRY_DSN` or `SENTRY_DSN` is configured.

`SENTRY_AUTH_TOKEN` is only for source map upload in trusted build environments and must never be committed or exposed to browser code.
