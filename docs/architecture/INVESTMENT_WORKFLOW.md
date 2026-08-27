# Investment Workflow Architecture

SparkHub must distinguish investment discovery from actual investment activity.

## Entity Boundary

The core chain is:

```text
profiles
  -> ideas
  -> investment_interests
  -> connections
  -> investments
```

These are separate entities with separate permissions and separate lifecycle states.

## Investment Interest

An investment interest means an investor has signaled interest in an idea.

It may contain:

- investor profile
- idea
- creator profile through the idea
- interest level
- preferred stage
- message or questions
- optional proposed range
- status

Suggested statuses:

- interested
- contacted
- discussion
- passed
- converted

An investment interest must not imply money changed hands.

## Connection

A connection means both sides have agreed to communicate in a platform-recognized relationship.

Suggested statuses:

- pending
- accepted
- declined
- blocked

Investor interest can exist before a connection. A connection can exist without an investment.

## Investment

An investment is a separate record that may be created later when there is a deliberate product and legal basis for recording it.

Suggested statuses:

- proposed
- committed
- active
- completed
- exited
- cancelled

Investment records must include visibility controls for sensitive financial fields.

## Safety Rules

- "I'm Interested" creates only an `investment_interests` record.
- Connecting with a creator creates or updates only a `connections` record.
- Creating an investment requires an explicit investment workflow.
- Do not expose private financial data through public pages, frontend state, or broad API policies.
- RLS must enforce creator, investor, connected-party, and admin visibility.
