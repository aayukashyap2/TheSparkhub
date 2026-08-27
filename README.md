# SparkHub

SparkHub is an idea discovery, innovation, collaboration, mentorship, and investor discovery platform.

The product is being built in small verified phases so architecture, database security, and UI quality stay aligned.

## Current Phase

Phase 1: foundation.

This phase initializes the Next.js project, records product architecture decisions, connects the repository, and prepares the project for Supabase-backed implementation.

## Source of Truth

- [Project brief](docs/PROJECT_BRIEF.md)
- [Phased build plan](docs/PHASES.md)
- [Investment workflow architecture](docs/architecture/INVESTMENT_WORKFLOW.md)
- [Routes and roles](docs/architecture/ROUTES_AND_ROLES.md)
- [Supabase plan](docs/architecture/SUPABASE_PLAN.md)

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

## Getting Started

Run the development server:

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
