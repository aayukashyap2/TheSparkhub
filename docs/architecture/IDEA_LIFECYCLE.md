# Idea Lifecycle and Engagement

Status: Phase 5 foundation.

SparkHub ideas are database-backed records, not static marketing cards. The Phase 5 implementation uses the schema created in Phase 2 and keeps idea engagement separate from investor interest.

## Lifecycle

```text
Draft -> Published -> Engagement -> Archived
```

- Draft ideas are private by default.
- Published ideas can appear on `/ideas`, `/explore`, and `/ideas/[slug]` when visibility is public.
- Archived ideas become private and leave public discovery.
- Creators manage their own ideas from `/app/idea-poster/ideas`.

## Engagement

Phase 5 wires the early public engagement tables:

- `idea_likes`
- `idea_saves`
- `idea_followers`
- `idea_shares`
- `comments`

These are attention, feedback, and relationship signals only.

## Investment Boundary

Phase 5 intentionally does not create `investment_interests` or `investments`.

Investor interest belongs to Phase 7 and must remain its own workflow:

```text
Idea -> Investment Interest -> Connection -> Investment
```

That protects SparkHub from treating a lightweight public action as a financial event.

## Current Routes

- `/ideas`: public published idea listing.
- `/explore`: public discovery surface backed by published ideas.
- `/ideas/[slug]`: public idea detail, engagement counts, actions, and comments.
- `/app/idea-poster`: creator dashboard with real idea and engagement counts.
- `/app/idea-poster/ideas`: creator idea management.
- `/app/idea-poster/ideas/new`: create idea.
- `/app/idea-poster/ideas/[id]/edit`: edit, publish, or archive own idea.

## Later Enhancements

- Tag creation and tag editing UI.
- Media uploads to the `idea-media` bucket.
- View tracking with anti-spam controls.
- Reposts and richer share channels.
- Full investor interest and connection workflow in Phase 7.
