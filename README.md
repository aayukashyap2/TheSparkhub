# SparkHub

SparkHub is an idea discovery, innovation, collaboration, mentorship, and investor discovery platform.

The product is being built in small verified phases so architecture, database security, and UI quality stay aligned.

## Current Phase

Phase 3: auth, roles, and onboarding.

The app now has Supabase auth foundations, Google/email entry points, database-backed onboarding roles, protected role workspaces, and Sentry instrumentation placeholders. Real login requires a local `.env.local` with the Supabase publishable key.

## Source of Truth

- [Project brief](docs/PROJECT_BRIEF.md)
- [Phased build plan](docs/PHASES.md)
- [Investment workflow architecture](docs/architecture/INVESTMENT_WORKFLOW.md)
- [Routes and roles](docs/architecture/ROUTES_AND_ROLES.md)
- [Supabase plan](docs/architecture/SUPABASE_PLAN.md)
- [Auth and onboarding architecture](docs/architecture/AUTH_AND_ONBOARDING.md)

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase
- Framer Motion
- Lucide React

## Environment

Copy `.env.example` to `.env.local` and fill in the publishable Supabase key.

Never commit real secrets. The Supabase service role key must not be used in browser code.

Sentry is optional until the production project is created. Keep `SENTRY_AUTH_TOKEN` server-side only and never expose it through a `NEXT_PUBLIC_` variable.

## Getting Started

Run the development server:

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If port 3000 is not responding, start the local server again:

```shell
npm run dev -- --hostname 127.0.0.1 --port 3000
```

## Verification

```shell
npm run lint
npm run build
```

## Product Boundary

SparkHub must keep investment discovery separate from actual investment records:

```text
Idea Poster -> Idea -> Investment Interest -> Connection -> Investment
```

Clicking "I'm Interested" creates an investment interest only. It must not create an investment or imply a financial transaction occurred.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
