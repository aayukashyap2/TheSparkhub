# Phase 7 Interest and Connection Workflow

SparkHub treats investor activity as a sequence of separate records:

1. Idea poster publishes an idea.
2. Investor creates an `investment_interests` record.
3. Either party can request a `connections` record from that interest.
4. The addressee accepts or declines the connection.
5. A future `investments` record can be created only as a separate deliberate action.

This keeps "I am interested" away from "an investment happened." The app never creates an `investments` row from public idea engagement or from the interest form.

## Implemented Surfaces

- Public idea detail pages expose an investor interest form.
- Investor `Investment Interests` shows interest records, connection state, and request controls.
- Idea poster `Investors` shows incoming interest records and connection controls.
- Investor `Connections` and idea poster `Collaborations` show the mutual connection state.

## Safety Boundaries

- Server actions re-check Supabase auth and role requirements.
- Interest creation requires the `investor` role.
- Creators cannot create interest in their own ideas.
- Connection acceptance and decline are limited to the addressee.
- Investment records remain unused in this phase.
