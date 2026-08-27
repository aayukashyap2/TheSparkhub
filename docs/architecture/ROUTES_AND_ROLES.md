# Routes and Roles

SparkHub must support role-specific product experiences with shared primitives and separate workflows.

## Public Website

- `/`
- `/about`
- `/explore`
- `/ideas`
- `/ideas/[slug]`
- `/investors`
- `/investors/[id]`
- `/mentors`
- `/mentors/[id]`
- `/contact`

## Auth

- `/login`
- `/signup`
- `/forgot-password`
- `/auth/callback`
- `/onboarding`

## Idea Poster App

- `/app/dashboard`
- `/app/my-ideas`
- `/app/ideas/new`
- `/app/ideas/[id]`
- `/app/engagement`
- `/app/investors`
- `/app/collaborations`
- `/app/mentors`
- `/app/notifications`
- `/app/messages`
- `/app/profile`
- `/app/settings`

## Investor App

- `/app/investor`
- `/app/investor/discover`
- `/app/investor/watchlist`
- `/app/investor/interests`
- `/app/investor/connections`
- `/app/investor/portfolio`
- `/app/investor/profile`

## Mentor App

- `/app/mentor`
- `/app/mentor/discover`
- `/app/mentor/requests`
- `/app/mentor/mentees`
- `/app/mentor/profile`

## Admin App

- `/admin`
- `/admin/dashboard`
- `/admin/users`
- `/admin/ideas`
- `/admin/investors`
- `/admin/investments`
- `/admin/interests`
- `/admin/mentors`
- `/admin/reports`
- `/admin/moderation`
- `/admin/analytics`
- `/admin/settings`

Admin routes require independent authorization and should not share the normal user dashboard layout.
