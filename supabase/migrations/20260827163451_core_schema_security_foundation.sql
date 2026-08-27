create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create type public.profile_role as enum ('idea_poster', 'investor', 'mentor', 'admin');
create type public.visibility_level as enum ('public', 'connections', 'private');
create type public.idea_visibility as enum ('public', 'unlisted', 'private');
create type public.idea_stage as enum ('idea', 'prototype', 'mvp', 'early_traction', 'growth');
create type public.idea_status as enum ('draft', 'published', 'archived');
create type public.member_role as enum ('owner', 'collaborator', 'mentor');
create type public.request_status as enum ('pending', 'accepted', 'declined', 'cancelled', 'blocked');
create type public.interest_level as enum ('low', 'medium', 'high');
create type public.investment_interest_status as enum ('interested', 'contacted', 'discussion', 'passed', 'converted');
create type public.investment_status as enum ('proposed', 'committed', 'active', 'completed', 'exited', 'cancelled');
create type public.portfolio_status as enum ('active', 'building', 'completed', 'exited', 'archived');
create type public.report_reason as enum ('spam', 'scam', 'abuse', 'misleading', 'inappropriate', 'fraud_concern', 'copyright', 'other');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'rejected');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  full_name text,
  username text unique,
  avatar_url text,
  headline text,
  bio text,
  location text,
  website_url text,
  visibility public.visibility_level not null default 'public',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (
    username is null or username ~ '^[a-z0-9][a-z0-9_]{2,29}$'
  )
);

create table public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.profile_role not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (profile_id, role)
);

create unique index profile_roles_one_primary_idx
  on public.profile_roles(profile_id)
  where is_primary;

create table public.user_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  interests text[] not null default '{}',
  sectors text[] not null default '{}',
  goals text[] not null default '{}',
  preferred_stages public.idea_stage[] not null default '{}',
  investment_range text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  constraint tags_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.ideas (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  summary text not null,
  problem text,
  solution text,
  target_users text,
  technology text,
  market_impact text,
  stage public.idea_stage not null default 'idea',
  status public.idea_status not null default 'draft',
  visibility public.idea_visibility not null default 'private',
  seeking_funding boolean not null default false,
  funding_goal numeric(14, 2),
  funding_currency char(3) not null default 'INR',
  funding_visibility public.visibility_level not null default 'private',
  use_of_funds text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ideas_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint ideas_funding_goal_positive check (funding_goal is null or funding_goal >= 0)
);

create table public.idea_tags (
  idea_id uuid not null references public.ideas(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (idea_id, tag_id)
);

create table public.idea_members (
  idea_id uuid not null references public.ideas(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.member_role not null default 'collaborator',
  created_at timestamptz not null default now(),
  primary key (idea_id, profile_id)
);

create table public.idea_likes (
  idea_id uuid not null references public.ideas(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (idea_id, profile_id)
);

create table public.idea_saves (
  idea_id uuid not null references public.ideas(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (idea_id, profile_id)
);

create table public.idea_followers (
  idea_id uuid not null references public.ideas(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (idea_id, profile_id)
);

create table public.idea_shares (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  channel text,
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reposts (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  unique (idea_id, profile_id)
);

create table public.collaboration_requests (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status public.request_status not null default 'pending',
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (idea_id, requester_id)
);

create table public.investor_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  investor_type text,
  bio text,
  sectors text[] not null default '{}',
  preferred_stages public.idea_stage[] not null default '{}',
  location_preference text,
  years_experience integer,
  portfolio_visibility public.visibility_level not null default 'public',
  investment_history_visibility public.visibility_level not null default 'private',
  public_investment_count integer not null default 0,
  active_interest_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint investor_profiles_years_nonnegative check (years_experience is null or years_experience >= 0)
);

create table public.mentor_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  expertise text[] not null default '{}',
  bio text,
  availability text,
  visibility public.visibility_level not null default 'public',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.investment_interests (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  investor_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  level public.interest_level not null default 'medium',
  preferred_stage public.idea_stage,
  message text,
  proposed_range text,
  questions text,
  status public.investment_interest_status not null default 'interested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (idea_id, investor_id),
  constraint investment_interests_not_creator check (investor_id <> creator_id)
);

create table public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  idea_id uuid references public.ideas(id) on delete set null,
  status public.request_status not null default 'pending',
  message text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint connections_not_self check (requester_id <> addressee_id)
);

create unique index connections_unique_context_idx
  on public.connections(requester_id, addressee_id, coalesce(idea_id, '00000000-0000-0000-0000-000000000000'::uuid));

create table public.investments (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete restrict,
  investor_id uuid not null references public.profiles(id) on delete restrict,
  creator_id uuid not null references public.profiles(id) on delete restrict,
  interest_id uuid references public.investment_interests(id) on delete set null,
  status public.investment_status not null default 'proposed',
  amount numeric(14, 2),
  currency char(3) not null default 'INR',
  amount_visibility public.visibility_level not null default 'private',
  thesis text,
  terms_summary text,
  recorded_by uuid references public.profiles(id) on delete set null,
  occurred_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint investments_amount_nonnegative check (amount is null or amount >= 0),
  constraint investments_not_self check (investor_id <> creator_id)
);

create table public.investor_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.profiles(id) on delete cascade,
  idea_id uuid references public.ideas(id) on delete set null,
  investment_id uuid references public.investments(id) on delete set null,
  title text,
  sector text,
  stage_at_investment public.idea_stage,
  status public.portfolio_status not null default 'active',
  visibility public.visibility_level not null default 'public',
  public_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references public.ideas(id) on delete set null,
  connection_id uuid references public.connections(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (conversation_id, profile_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  idea_id uuid references public.ideas(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null,
  target_id uuid not null,
  reason public.report_reason not null,
  details text,
  status public.report_status not null default 'open',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profile_roles
    where profile_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to anon, authenticated, service_role;

create or replace function private.is_idea_member(target_idea_id uuid)
returns boolean
language sql
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.idea_members
    where idea_id = target_idea_id
      and profile_id = (select auth.uid())
  );
$$;

revoke all on function private.is_idea_member(uuid) from public;
grant execute on function private.is_idea_member(uuid) to anon, authenticated, service_role;

create or replace function private.is_connected(target_profile_id uuid)
returns boolean
language sql
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.connections
    where status = 'accepted'
      and (
        (requester_id = (select auth.uid()) and addressee_id = target_profile_id)
        or (addressee_id = (select auth.uid()) and requester_id = target_profile_id)
      )
  );
$$;

revoke all on function private.is_connected(uuid) from public;
grant execute on function private.is_connected(uuid) to anon, authenticated, service_role;

create or replace function private.is_conversation_member(target_conversation_id uuid)
returns boolean
language sql
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.conversation_members
    where conversation_id = target_conversation_id
      and profile_id = (select auth.uid())
  );
$$;

revoke all on function private.is_conversation_member(uuid) from public;
grant execute on function private.is_conversation_member(uuid) to authenticated, service_role;

create or replace function public.set_investment_interest_creator()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  idea_creator uuid;
begin
  select creator_id into idea_creator
  from public.ideas
  where id = new.idea_id;

  if idea_creator is null then
    raise exception 'Idea % does not exist', new.idea_id;
  end if;

  new.creator_id = idea_creator;
  return new;
end;
$$;

revoke all on function public.set_investment_interest_creator() from public, anon, authenticated;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger user_preferences_set_updated_at before update on public.user_preferences
  for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();
create trigger ideas_set_updated_at before update on public.ideas
  for each row execute function public.set_updated_at();
create trigger comments_set_updated_at before update on public.comments
  for each row execute function public.set_updated_at();
create trigger collaboration_requests_set_updated_at before update on public.collaboration_requests
  for each row execute function public.set_updated_at();
create trigger investor_profiles_set_updated_at before update on public.investor_profiles
  for each row execute function public.set_updated_at();
create trigger mentor_profiles_set_updated_at before update on public.mentor_profiles
  for each row execute function public.set_updated_at();
create trigger investment_interests_set_updated_at before update on public.investment_interests
  for each row execute function public.set_updated_at();
create trigger connections_set_updated_at before update on public.connections
  for each row execute function public.set_updated_at();
create trigger investments_set_updated_at before update on public.investments
  for each row execute function public.set_updated_at();
create trigger investor_portfolio_items_set_updated_at before update on public.investor_portfolio_items
  for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations
  for each row execute function public.set_updated_at();
create trigger reports_set_updated_at before update on public.reports
  for each row execute function public.set_updated_at();

create trigger investment_interests_set_creator
  before insert or update of idea_id on public.investment_interests
  for each row execute function public.set_investment_interest_creator();

create index profiles_visibility_idx on public.profiles(visibility);
create index profile_roles_role_idx on public.profile_roles(role);
create index ideas_creator_id_idx on public.ideas(creator_id);
create index ideas_public_discovery_idx on public.ideas(status, visibility, published_at desc);
create index ideas_category_id_idx on public.ideas(category_id);
create index idea_members_profile_id_idx on public.idea_members(profile_id);
create index comments_idea_id_created_at_idx on public.comments(idea_id, created_at desc);
create index collaboration_requests_requester_id_idx on public.collaboration_requests(requester_id);
create index investment_interests_investor_id_idx on public.investment_interests(investor_id);
create index investment_interests_creator_id_idx on public.investment_interests(creator_id);
create index investment_interests_status_idx on public.investment_interests(status);
create index connections_addressee_id_idx on public.connections(addressee_id);
create index connections_status_idx on public.connections(status);
create index investments_investor_id_idx on public.investments(investor_id);
create index investments_creator_id_idx on public.investments(creator_id);
create index investor_portfolio_items_investor_id_idx on public.investor_portfolio_items(investor_id);
create index conversation_members_profile_id_idx on public.conversation_members(profile_id);
create index messages_conversation_id_created_at_idx on public.messages(conversation_id, created_at);
create index notifications_recipient_read_idx on public.notifications(recipient_id, read_at, created_at desc);
create index reports_status_idx on public.reports(status);

alter table public.profiles enable row level security;
alter table public.profile_roles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.ideas enable row level security;
alter table public.idea_tags enable row level security;
alter table public.idea_members enable row level security;
alter table public.idea_likes enable row level security;
alter table public.idea_saves enable row level security;
alter table public.idea_followers enable row level security;
alter table public.idea_shares enable row level security;
alter table public.comments enable row level security;
alter table public.reposts enable row level security;
alter table public.collaboration_requests enable row level security;
alter table public.investor_profiles enable row level security;
alter table public.mentor_profiles enable row level security;
alter table public.investment_interests enable row level security;
alter table public.connections enable row level security;
alter table public.investments enable row level security;
alter table public.investor_portfolio_items enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.profiles, public.categories, public.tags, public.ideas, public.idea_tags, public.idea_members, public.idea_likes, public.idea_saves, public.idea_followers, public.idea_shares, public.comments, public.reposts, public.investor_profiles, public.mentor_profiles, public.investor_portfolio_items to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;

create policy "Public profiles are visible" on public.profiles
  for select to anon, authenticated
  using (
    visibility = 'public'
    or id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_connected(profiles.id))
  );
create policy "Users create own profile" on public.profiles
  for insert to authenticated
  with check (id = (select auth.uid()));
create policy "Users update own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()))
  with check (id = (select auth.uid()) or (select private.is_admin()));

create policy "Users read own roles" on public.profile_roles
  for select to authenticated
  using (profile_id = (select auth.uid()) or (select private.is_admin()));
create policy "Users create own non-admin roles" on public.profile_roles
  for insert to authenticated
  with check (profile_id = (select auth.uid()) and role <> 'admin');
create policy "Users remove own non-admin roles" on public.profile_roles
  for delete to authenticated
  using ((profile_id = (select auth.uid()) and role <> 'admin') or (select private.is_admin()));
create policy "Admins manage roles" on public.profile_roles
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Users manage own preferences" on public.user_preferences
  for all to authenticated
  using (profile_id = (select auth.uid()) or (select private.is_admin()))
  with check (profile_id = (select auth.uid()) or (select private.is_admin()));

create policy "Active categories are visible" on public.categories
  for select to anon, authenticated
  using (is_active or (select private.is_admin()));
create policy "Admins manage categories" on public.categories
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Tags are visible" on public.tags
  for select to anon, authenticated
  using (true);
create policy "Admins manage tags" on public.tags
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Ideas follow visibility" on public.ideas
  for select to anon, authenticated
  using (
    (status = 'published' and visibility = 'public')
    or creator_id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_idea_member(ideas.id))
  );
create policy "Creators create ideas" on public.ideas
  for insert to authenticated
  with check (creator_id = (select auth.uid()) or (select private.is_admin()));
create policy "Creators update ideas" on public.ideas
  for update to authenticated
  using (creator_id = (select auth.uid()) or (select private.is_admin()))
  with check (creator_id = (select auth.uid()) or (select private.is_admin()));
create policy "Creators delete ideas" on public.ideas
  for delete to authenticated
  using (creator_id = (select auth.uid()) or (select private.is_admin()));

create policy "Idea tags are visible with idea" on public.idea_tags
  for select to anon, authenticated
  using (exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Idea owners manage tags" on public.idea_tags
  for all to authenticated
  using (
    (select private.is_admin())
    or exists (select 1 from public.ideas i where i.id = idea_id and i.creator_id = (select auth.uid()))
  )
  with check (
    (select private.is_admin())
    or exists (select 1 from public.ideas i where i.id = idea_id and i.creator_id = (select auth.uid()))
  );

create policy "Idea members are visible with idea" on public.idea_members
  for select to anon, authenticated
  using (exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Idea owners manage members" on public.idea_members
  for all to authenticated
  using (
    (select private.is_admin())
    or exists (select 1 from public.ideas i where i.id = idea_id and i.creator_id = (select auth.uid()))
  )
  with check (
    (select private.is_admin())
    or exists (select 1 from public.ideas i where i.id = idea_id and i.creator_id = (select auth.uid()))
  );

create policy "Idea likes are visible with idea" on public.idea_likes
  for select to anon, authenticated
  using (exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Users like visible ideas" on public.idea_likes
  for insert to authenticated
  with check (profile_id = (select auth.uid()) and exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Users remove own likes" on public.idea_likes
  for delete to authenticated
  using (profile_id = (select auth.uid()) or (select private.is_admin()));

create policy "Idea saves are visible with idea" on public.idea_saves
  for select to anon, authenticated
  using (exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Users save visible ideas" on public.idea_saves
  for insert to authenticated
  with check (profile_id = (select auth.uid()) and exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Users remove own saves" on public.idea_saves
  for delete to authenticated
  using (profile_id = (select auth.uid()) or (select private.is_admin()));

create policy "Idea followers are visible with idea" on public.idea_followers
  for select to anon, authenticated
  using (exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Users follow visible ideas" on public.idea_followers
  for insert to authenticated
  with check (profile_id = (select auth.uid()) and exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Users remove own follows" on public.idea_followers
  for delete to authenticated
  using (profile_id = (select auth.uid()) or (select private.is_admin()));

create policy "Idea shares are visible with idea" on public.idea_shares
  for select to anon, authenticated
  using (exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Users record visible idea shares" on public.idea_shares
  for insert to authenticated
  with check (profile_id = (select auth.uid()) and exists (select 1 from public.ideas i where i.id = idea_id));

create policy "Visible comments are readable with idea" on public.comments
  for select to anon, authenticated
  using (not is_hidden and exists (select 1 from public.ideas i where i.id = idea_id) or (select private.is_admin()));
create policy "Users comment on visible ideas" on public.comments
  for insert to authenticated
  with check (author_id = (select auth.uid()) and exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Users update own comments" on public.comments
  for update to authenticated
  using (author_id = (select auth.uid()) or (select private.is_admin()))
  with check (author_id = (select auth.uid()) or (select private.is_admin()));
create policy "Users delete own comments" on public.comments
  for delete to authenticated
  using (author_id = (select auth.uid()) or (select private.is_admin()));

create policy "Reposts are visible with idea" on public.reposts
  for select to anon, authenticated
  using (exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Users repost visible ideas" on public.reposts
  for insert to authenticated
  with check (profile_id = (select auth.uid()) and exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Users delete own reposts" on public.reposts
  for delete to authenticated
  using (profile_id = (select auth.uid()) or (select private.is_admin()));

create policy "Collaboration requests visible to parties" on public.collaboration_requests
  for select to authenticated
  using (
    requester_id = (select auth.uid())
    or (select private.is_admin())
    or exists (select 1 from public.ideas i where i.id = idea_id and i.creator_id = (select auth.uid()))
  );
create policy "Users request collaboration on visible ideas" on public.collaboration_requests
  for insert to authenticated
  with check (requester_id = (select auth.uid()) and exists (select 1 from public.ideas i where i.id = idea_id));
create policy "Collaboration parties update requests" on public.collaboration_requests
  for update to authenticated
  using (
    requester_id = (select auth.uid())
    or (select private.is_admin())
    or exists (select 1 from public.ideas i where i.id = idea_id and i.creator_id = (select auth.uid()))
  )
  with check (
    requester_id = (select auth.uid())
    or (select private.is_admin())
    or exists (select 1 from public.ideas i where i.id = idea_id and i.creator_id = (select auth.uid()))
  );

create policy "Investor profiles follow visibility" on public.investor_profiles
  for select to anon, authenticated
  using (
    portfolio_visibility = 'public'
    or profile_id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_connected(investor_profiles.profile_id))
  );
create policy "Users manage own investor profile" on public.investor_profiles
  for all to authenticated
  using (profile_id = (select auth.uid()) or (select private.is_admin()))
  with check (profile_id = (select auth.uid()) or (select private.is_admin()));

create policy "Mentor profiles follow visibility" on public.mentor_profiles
  for select to anon, authenticated
  using (
    visibility = 'public'
    or profile_id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_connected(mentor_profiles.profile_id))
  );
create policy "Users manage own mentor profile" on public.mentor_profiles
  for all to authenticated
  using (profile_id = (select auth.uid()) or (select private.is_admin()))
  with check (profile_id = (select auth.uid()) or (select private.is_admin()));

create policy "Investment interests visible to investor creator admin" on public.investment_interests
  for select to authenticated
  using (
    investor_id = (select auth.uid())
    or creator_id = (select auth.uid())
    or (select private.is_admin())
  );
create policy "Investors create interest records" on public.investment_interests
  for insert to authenticated
  with check (
    investor_id = (select auth.uid())
    and investor_id <> creator_id
    and exists (select 1 from public.investor_profiles ip where ip.profile_id = (select auth.uid()))
    and exists (select 1 from public.ideas i where i.id = idea_id and i.status = 'published')
  );
create policy "Investment interest parties update records" on public.investment_interests
  for update to authenticated
  using (investor_id = (select auth.uid()) or creator_id = (select auth.uid()) or (select private.is_admin()))
  with check (investor_id = (select auth.uid()) or creator_id = (select auth.uid()) or (select private.is_admin()));
create policy "Investors delete own interests" on public.investment_interests
  for delete to authenticated
  using (investor_id = (select auth.uid()) or (select private.is_admin()));

create policy "Connections visible to parties" on public.connections
  for select to authenticated
  using (requester_id = (select auth.uid()) or addressee_id = (select auth.uid()) or (select private.is_admin()));
create policy "Users request connections" on public.connections
  for insert to authenticated
  with check (requester_id = (select auth.uid()) and requester_id <> addressee_id);
create policy "Connection parties update" on public.connections
  for update to authenticated
  using (requester_id = (select auth.uid()) or addressee_id = (select auth.uid()) or (select private.is_admin()))
  with check (requester_id = (select auth.uid()) or addressee_id = (select auth.uid()) or (select private.is_admin()));
create policy "Requesters delete pending connections" on public.connections
  for delete to authenticated
  using ((requester_id = (select auth.uid()) and status = 'pending') or (select private.is_admin()));

create policy "Investments visible only to parties" on public.investments
  for select to authenticated
  using (investor_id = (select auth.uid()) or creator_id = (select auth.uid()) or (select private.is_admin()));
create policy "Investment parties create explicit investment records" on public.investments
  for insert to authenticated
  with check (
    recorded_by = (select auth.uid())
    and (investor_id = (select auth.uid()) or creator_id = (select auth.uid()) or (select private.is_admin()))
  );
create policy "Investment parties update records" on public.investments
  for update to authenticated
  using (investor_id = (select auth.uid()) or creator_id = (select auth.uid()) or (select private.is_admin()))
  with check (investor_id = (select auth.uid()) or creator_id = (select auth.uid()) or (select private.is_admin()));

create policy "Portfolio items follow visibility" on public.investor_portfolio_items
  for select to anon, authenticated
  using (
    visibility = 'public'
    or investor_id = (select auth.uid())
    or (select private.is_admin())
    or (
      visibility = 'connections'
      and (select private.is_connected(investor_portfolio_items.investor_id))
    )
  );
create policy "Investors manage own portfolio" on public.investor_portfolio_items
  for all to authenticated
  using (investor_id = (select auth.uid()) or (select private.is_admin()))
  with check (investor_id = (select auth.uid()) or (select private.is_admin()));

create policy "Conversation members read conversations" on public.conversations
  for select to authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = conversations.id
        and cm.profile_id = (select auth.uid())
    )
  );
create policy "Admins create conversations" on public.conversations
  for insert to authenticated
  with check ((select private.is_admin()));
create policy "Admins update conversations" on public.conversations
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Conversation members are visible to members" on public.conversation_members
  for select to authenticated
  using (
    profile_id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_conversation_member(conversation_id))
  );
create policy "Admins manage conversation members" on public.conversation_members
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
create policy "Members update own read state" on public.conversation_members
  for update to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy "Conversation members read messages" on public.messages
  for select to authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = messages.conversation_id
        and cm.profile_id = (select auth.uid())
    )
  );
create policy "Conversation members send messages" on public.messages
  for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = messages.conversation_id
        and cm.profile_id = (select auth.uid())
    )
  );

create policy "Users read own notifications" on public.notifications
  for select to authenticated
  using (recipient_id = (select auth.uid()) or (select private.is_admin()));
create policy "Users mark own notifications read" on public.notifications
  for update to authenticated
  using (recipient_id = (select auth.uid()) or (select private.is_admin()))
  with check (recipient_id = (select auth.uid()) or (select private.is_admin()));
create policy "Admins create notifications" on public.notifications
  for insert to authenticated
  with check ((select private.is_admin()));

create policy "Users read own reports" on public.reports
  for select to authenticated
  using (reporter_id = (select auth.uid()) or (select private.is_admin()));
create policy "Users create reports" on public.reports
  for insert to authenticated
  with check (reporter_id = (select auth.uid()));
create policy "Admins update reports" on public.reports
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('idea-media', 'idea-media', false, 20971520, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']),
  ('portfolio-media', 'portfolio-media', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 10485760, array['application/pdf'])
on conflict (id) do nothing;

create policy "Public avatar files are readable" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'avatars');
create policy "Users upload own avatar files" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "Users manage own avatar files" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and owner = (select auth.uid()))
  with check (bucket_id = 'avatars' and owner = (select auth.uid()));
create policy "Users delete own avatar files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and owner = (select auth.uid()));

create policy "Idea media follows idea visibility" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'idea-media'
    and exists (
      select 1 from public.ideas i
      where i.id::text = (storage.foldername(name))[1]
    )
  );
create policy "Idea owners upload idea media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'idea-media'
    and exists (
      select 1 from public.ideas i
      where i.id::text = (storage.foldername(name))[1]
        and i.creator_id = (select auth.uid())
    )
  );
create policy "Idea owners manage idea media" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'idea-media'
    and exists (
      select 1 from public.ideas i
      where i.id::text = (storage.foldername(name))[1]
        and (i.creator_id = (select auth.uid()) or (select private.is_admin()))
    )
  )
  with check (
    bucket_id = 'idea-media'
    and exists (
      select 1 from public.ideas i
      where i.id::text = (storage.foldername(name))[1]
        and (i.creator_id = (select auth.uid()) or (select private.is_admin()))
    )
  );
create policy "Idea owners delete idea media" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'idea-media'
    and exists (
      select 1 from public.ideas i
      where i.id::text = (storage.foldername(name))[1]
        and (i.creator_id = (select auth.uid()) or (select private.is_admin()))
    )
  );

create policy "Portfolio media follows portfolio visibility" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'portfolio-media'
    and exists (
      select 1 from public.investor_portfolio_items item
      where item.id::text = (storage.foldername(name))[1]
    )
  );
create policy "Investors upload own portfolio media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and exists (
      select 1 from public.investor_portfolio_items item
      where item.id::text = (storage.foldername(name))[1]
        and item.investor_id = (select auth.uid())
    )
  );
create policy "Investors manage own portfolio media" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'portfolio-media'
    and exists (
      select 1 from public.investor_portfolio_items item
      where item.id::text = (storage.foldername(name))[1]
        and (item.investor_id = (select auth.uid()) or (select private.is_admin()))
    )
  )
  with check (
    bucket_id = 'portfolio-media'
    and exists (
      select 1 from public.investor_portfolio_items item
      where item.id::text = (storage.foldername(name))[1]
        and (item.investor_id = (select auth.uid()) or (select private.is_admin()))
    )
  );
create policy "Investors delete own portfolio media" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'portfolio-media'
    and exists (
      select 1 from public.investor_portfolio_items item
      where item.id::text = (storage.foldername(name))[1]
        and (item.investor_id = (select auth.uid()) or (select private.is_admin()))
    )
  );

create policy "Users read own documents" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'documents'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select private.is_admin()))
  );
create policy "Users upload own documents" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "Users manage own documents" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'documents'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select private.is_admin()))
  )
  with check (
    bucket_id = 'documents'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select private.is_admin()))
  );
create policy "Users delete own documents" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'documents'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select private.is_admin()))
  );

do $$
declare
  missing_rls integer;
  expected_tables text[] := array[
    'profiles',
    'profile_roles',
    'user_preferences',
    'categories',
    'tags',
    'ideas',
    'idea_tags',
    'idea_members',
    'idea_likes',
    'idea_saves',
    'idea_followers',
    'idea_shares',
    'comments',
    'reposts',
    'collaboration_requests',
    'investor_profiles',
    'mentor_profiles',
    'investment_interests',
    'connections',
    'investments',
    'investor_portfolio_items',
    'conversations',
    'conversation_members',
    'messages',
    'notifications',
    'reports'
  ];
begin
  select count(*)
  into missing_rls
  from unnest(expected_tables) as table_name
  left join pg_class c on c.relname = table_name
  left join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
  where c.oid is null or c.relrowsecurity is distinct from true;

  if missing_rls > 0 then
    raise exception 'SparkHub core schema RLS verification failed for % table(s)', missing_rls;
  end if;

  if not exists (select 1 from storage.buckets where id = 'avatars') then
    raise exception 'SparkHub storage bucket verification failed';
  end if;
end;
$$;
