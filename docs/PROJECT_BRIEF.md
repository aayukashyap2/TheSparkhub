# SparkHub Project Brief

SparkHub is an idea discovery, innovation, collaboration, mentorship, and investor discovery platform.

The product is not a generic social app and not a simple idea submission site. It should help creators make ideas discoverable, help investors evaluate opportunities safely, help mentors and collaborators find people to support, and give admins a separate operations console.

## Core Product Experiences

SparkHub has three major surfaces:

- Public website for visitors, creators, investors, mentors, and collaborators.
- Authenticated user application for idea posters, investors, mentors, and collaborators.
- Separate admin application for moderation, analytics, user management, and investment-related oversight.

The user app and admin app may share primitives, but they must not collapse into one generic dashboard.

## Primary Roles

- Idea Poster: creates, manages, develops, and grows ideas.
- Investor: discovers ideas, saves opportunities, expresses interest, connects with creators, and manages portfolio records.
- Mentor: discovers ideas, offers guidance, accepts mentorship requests, and communicates with creators.
- Admin: operates and moderates the platform with independent authorization.

Roles are product workflows and authorization concepts. They must not be treated as cosmetic sidebar switches.

## Non-Negotiable Investment Boundary

The investment-related journey must be modeled as:

```text
Idea Poster
  -> Idea
  -> Investment Interest
  -> Connection
  -> Investment
```

Clicking "I'm Interested" creates an investment interest only. It does not create an investment, imply funding occurred, or start a financial transaction.

## Quality Bar

Every phase should leave the project more real, not just more decorated. Prefer database-backed flows, clear permissions, visible empty/loading/error states, responsive layouts, reduced-motion support, and explicit verification.
