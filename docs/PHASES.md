# SparkHub Phased Build Plan

This roadmap compresses the full product specification into fewer delivery phases so each phase can be verified before the next one begins.

## Phase 1: Foundation

Goal: create the technical and documentation base.

- Initialize Next.js, TypeScript, Tailwind CSS, ESLint, and Git.
- Connect the local project to the GitHub repository.
- Add project brief, route map, data model notes, environment docs, and phase acceptance criteria.
- Install foundational dependencies only.

Exit criteria:

- `npm run lint` passes.
- `npm run build` passes.
- First commit is pushed to GitHub.

## Phase 2: Supabase Schema and Security Foundation

Goal: define the real platform data model before feature work.

Status: applied to the live `The SparkHub` Supabase project on 2026-08-27.

- Create Supabase migrations for profiles, roles, ideas, tags, categories, investment interests, connections, investments, notifications, reports, and storage buckets.
- Enable RLS on exposed tables.
- Add explicit grants where Data API exposure is required.
- Add policies for owners, connected parties, public records, and admins.
- Document financial privacy boundaries.

Exit criteria:

- Migrations apply successfully.
- RLS policies are reviewed table by table.
- Basic test queries prove unauthorized users cannot read private data.

Verification:

- Live migration history contains the core schema and foreign-key index migrations.
- All 26 public application tables have RLS enabled.
- Anonymous users can select public ideas but cannot select `investment_interests` or `investments`.
- Supabase security advisor reports no lints.

## Phase 3: Auth, Roles, and Onboarding

Goal: make identity and role selection real.

Status: foundation implemented on 2026-08-27.

- Implement Supabase email/password and Google OAuth.
- Add auth callback, session refresh, logout, and password reset.
- Build role-aware onboarding for idea posters, investors, and mentors.
- Store authorization data in trusted database records, not browser-only state.

Exit criteria:

- Email/password and Google auth routes are implemented.
- Onboarding persists role-specific profile data after Supabase env keys are configured locally.
- Protected routes redirect correctly and are forced to request-time rendering.

Implementation notes:

- `admin` is intentionally not self-selectable during onboarding.
- Role-specific pages are separate protected routes, not one cosmetic sidebar switch.
- Sentry files are present but dormant until DSN environment variables are configured.

## Phase 4: Design System and Public Product Surface

Goal: establish the professional UI/UX direction.

Status: foundation implemented on 2026-08-30.

- Use Google Stitch for visual exploration.
- Implement theme tokens, reusable components, and motion rules.
- Build public homepage, explore shell, ideas shell, investors shell, mentors shell, footer, and SEO metadata.

Exit criteria:

- Desktop and mobile screenshots are visually checked.
- Reduced-motion mode is respected.
- Public pages do not show fake production metrics.

Implementation notes:

- The first public UI foundation uses the Google Stitch design system asset documented in `docs/architecture/DESIGN_SYSTEM.md`.
- The homepage uses a generated product-network visual stored in `public/images/sparkhub-hero-network.png`.
- Light/dark mode remains a later design-system enhancement because the first Phase 4 pass prioritizes route coverage, product logic, and responsive composition.

## Phase 5: Idea Lifecycle and Engagement

Goal: make ideas the central database-backed object.

Status: foundation implemented on 2026-09-04.

- Create, edit, publish, archive, and view ideas.
- Add categories, visibility, funding profile fields, and idea detail pages.
- Add likes, comments, saves, shares, and follows.

Exit criteria:

- Idea poster can create and manage an idea.
- Public users can view public ideas.
- Engagement counts come from real records.

Implementation notes:

- The shipped Phase 5 scope uses the existing Supabase tables from Phase 2.
- Public discovery reads only published, public ideas.
- Draft and archived ideas remain creator-owned workspace records.
- Tags, media uploads, repost UI, and view tracking remain later Phase 5 refinements or Phase 8 follow-ups.
- Investor interest is intentionally not implemented here; it belongs to Phase 7.

## Phase 6: Role-Specific Applications

Goal: build distinct app experiences backed by distinct workflows.

Status: foundation implemented on 2026-09-04.

- Idea Poster: dashboard, my ideas, engagement, investors, collaborations, mentors.
- Investor: dashboard, discover, watchlist, investment interests, connections, portfolio, profile.
- Mentor: dashboard, expertise, discover, mentorship requests, mentees.

Exit criteria:

- Navigation, data queries, and empty states differ by role.
- Role checks are enforced outside the UI.

Implementation notes:

- A shared protected app shell now renders role-specific navigation.
- Investor discovery reads public ideas; watchlist reads saved ideas; interests read `investment_interests` without creating them.
- Mentor discovery reads public ideas; requests and mentees are separate mentorship surfaces.
- Idea poster engagement uses real idea engagement counts.
- Connection creation and investment interest creation remain Phase 7.

## Phase 7: Investment Interest and Connection Workflow

Goal: implement the safest investment-related core.

Status: foundation implemented on 2026-09-04.

- Create investment interest workflow with states such as interested, contacted, discussion, passed, and converted.
- Create connection requests with pending, accepted, declined, and blocked states.
- Add creator and investor views of the same workflow.
- Keep investments as a separate record type.

Exit criteria:

- "I'm Interested" never creates an investment.
- Both parties can track interest and connection state.
- Private financial fields remain protected.

Implementation notes:

- Public idea detail pages now create `investment_interests` from investor-only server actions.
- Existing interest cards let investors or creators request a `connection` before any investment record exists.
- Pending connection requests can be accepted or declined by the addressee.
- Investor and idea-poster workspaces show interest and connection state with idea titles and counterpart names instead of raw database IDs.
- Homepage annotations from Phase 7 were addressed with shorter hero copy, subtle motion cues, clearer role copy, and a real demo footer.

## Phase 8: Notifications, Messaging, and Matching

Goal: support collaboration loops.

- Add notification center, unread counts, read state, and event creation.
- Add connected-user messaging foundation.
- Add trending and recommendation foundations based on real engagement and profile preferences.

Exit criteria:

- Notifications are generated by real events.
- Messages require authorization.
- Trending uses recent signals, not only total likes.

## Phase 9: Admin, Moderation, and Analytics

Goal: provide a separate operations console.

- Build admin dashboard, user management, idea moderation, investor oversight, reports, categories, and analytics.
- Add verification badge management.
- Audit admin access separately from user app access.

Exit criteria:

- Admin routes are separately protected.
- Reports can be reviewed and resolved.
- Admin analytics use real database data.

## Phase 10: Production Readiness

Goal: prepare SparkHub for deployment and launch testing.

- Add Sentry.
- Run accessibility, responsive, security, RLS, and performance audits.
- Configure Vercel deployment, environment variables, OAuth redirect URLs, and production build checks.
- Complete end-to-end journey tests for idea poster, investor, mentor, and admin.

Exit criteria:

- Production build passes.
- Auth redirects are configured.
- No known critical security gaps remain.
