# Role-Specific Applications

Status: Phase 6 foundation.

SparkHub role experiences are separate product workflows, not a single dashboard with cosmetic role labels.

## Shared App Shell

Phase 6 introduces a shared protected app shell with role-specific navigation:

- Idea Poster: Dashboard, My Ideas, Create, Engagement, Investors, Collaborations, Mentors.
- Investor: Dashboard, Discover, Watchlist, Investment Interests, Connections, Portfolio, Profile.
- Mentor: Dashboard, Expertise, Discover, Mentorship Requests, Mentees, Profile.

The shell is shared for visual consistency, but the route families and data reads are role-specific.

## Idea Poster

Implemented routes:

- `/app/idea-poster`
- `/app/idea-poster/ideas`
- `/app/idea-poster/ideas/new`
- `/app/idea-poster/ideas/[id]/edit`
- `/app/idea-poster/engagement`
- `/app/idea-poster/investors`
- `/app/idea-poster/collaborations`
- `/app/idea-poster/mentors`

The dashboard and engagement page use real idea and engagement records. Investor, collaboration, and mentor pages establish separate workflow surfaces for later feature work.

## Investor

Implemented routes:

- `/app/investor`
- `/app/investor/discover`
- `/app/investor/watchlist`
- `/app/investor/interests`
- `/app/investor/connections`
- `/app/investor/portfolio`
- `/app/investor/profile`

Investor discover reads public ideas. Watchlist reads saved ideas. Investment interests display only actual `investment_interests` records when they exist. Portfolio remains downstream of actual investment records.

## Mentor

Implemented routes:

- `/app/mentor`
- `/app/mentor/discover`
- `/app/mentor/requests`
- `/app/mentor/mentees`
- `/app/mentor/profile`

Mentor discover reads public ideas. Requests and mentees are separate mentorship surfaces, not investment workflows.

## Boundary

Phase 6 still does not create `investment_interests`, `connections`, or `investments`.

Those belong to Phase 7:

```text
Idea -> Investment Interest -> Connection -> Investment
```
