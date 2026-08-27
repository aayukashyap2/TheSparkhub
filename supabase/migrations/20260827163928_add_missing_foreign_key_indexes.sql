create index if not exists categories_created_by_idx
  on public.categories(created_by);

create index if not exists comments_author_id_idx
  on public.comments(author_id);

create index if not exists comments_parent_id_idx
  on public.comments(parent_id);

create index if not exists connections_idea_id_idx
  on public.connections(idea_id);

create index if not exists conversations_connection_id_idx
  on public.conversations(connection_id);

create index if not exists conversations_idea_id_idx
  on public.conversations(idea_id);

create index if not exists idea_followers_profile_id_idx
  on public.idea_followers(profile_id);

create index if not exists idea_likes_profile_id_idx
  on public.idea_likes(profile_id);

create index if not exists idea_saves_profile_id_idx
  on public.idea_saves(profile_id);

create index if not exists idea_shares_idea_id_idx
  on public.idea_shares(idea_id);

create index if not exists idea_shares_profile_id_idx
  on public.idea_shares(profile_id);

create index if not exists idea_tags_tag_id_idx
  on public.idea_tags(tag_id);

create index if not exists investments_idea_id_idx
  on public.investments(idea_id);

create index if not exists investments_interest_id_idx
  on public.investments(interest_id);

create index if not exists investments_recorded_by_idx
  on public.investments(recorded_by);

create index if not exists investor_portfolio_items_idea_id_idx
  on public.investor_portfolio_items(idea_id);

create index if not exists investor_portfolio_items_investment_id_idx
  on public.investor_portfolio_items(investment_id);

create index if not exists messages_sender_id_idx
  on public.messages(sender_id);

create index if not exists notifications_actor_id_idx
  on public.notifications(actor_id);

create index if not exists notifications_idea_id_idx
  on public.notifications(idea_id);

create index if not exists reports_reporter_id_idx
  on public.reports(reporter_id);

create index if not exists reports_reviewed_by_idx
  on public.reports(reviewed_by);

create index if not exists reposts_profile_id_idx
  on public.reposts(profile_id);
