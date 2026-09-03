import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type IdeaRow = Database["public"]["Tables"]["ideas"]["Row"];
export type CommentRow = Database["public"]["Tables"]["comments"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export type IdeaEngagement = {
  likes: number;
  saves: number;
  followers: number;
  comments: number;
  shares: number;
};

export type PublicIdea = IdeaRow & {
  creatorName: string;
  categoryName: string | null;
  engagement: IdeaEngagement;
};

export type IdeaComment = CommentRow & {
  authorName: string;
};

export type InvestorProfileRow =
  Database["public"]["Tables"]["investor_profiles"]["Row"];
export type MentorProfileRow =
  Database["public"]["Tables"]["mentor_profiles"]["Row"];
export type InvestmentInterestRow =
  Database["public"]["Tables"]["investment_interests"]["Row"];
export type ConnectionRow = Database["public"]["Tables"]["connections"]["Row"];

export type InvestmentInterestWithContext = InvestmentInterestRow & {
  connectionAddresseeId: string | null;
  connectionId: string | null;
  connectionRequesterId: string | null;
  connectionStatus: ConnectionRow["status"] | null;
  creatorName: string;
  ideaSlug: string | null;
  ideaTitle: string;
  investorName: string;
};

export type ConnectionWithContext = ConnectionRow & {
  addresseeName: string;
  ideaSlug: string | null;
  ideaTitle: string | null;
  otherName: string;
  requesterName: string;
};

const IDEA_SELECT =
  "id, creator_id, category_id, title, slug, summary, problem, solution, target_users, technology, market_impact, stage, status, visibility, seeking_funding, funding_goal, funding_currency, funding_visibility, use_of_funds, published_at, created_at, updated_at";

export async function listCategories() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, description, is_active, created_by, created_at, updated_at")
    .eq("is_active", true)
    .order("name");

  return data ?? [];
}

export async function listPublicIdeas(limit = 24): Promise<PublicIdea[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("ideas")
    .select(IDEA_SELECT)
    .eq("status", "published")
    .eq("visibility", "public")
    .order("published_at", { ascending: false })
    .limit(limit);

  return attachIdeaMetadata(data ?? []);
}

export async function getPublicIdea(slug: string): Promise<PublicIdea | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("ideas")
    .select(IDEA_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .eq("visibility", "public")
    .maybeSingle();

  const ideas = await attachIdeaMetadata(data ? [data] : []);
  return ideas[0] ?? null;
}

export async function listCreatorIdeas(creatorId: string): Promise<PublicIdea[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("ideas")
    .select(IDEA_SELECT)
    .eq("creator_id", creatorId)
    .order("updated_at", { ascending: false });

  return attachIdeaMetadata(data ?? []);
}

export async function listSavedIdeas(profileId: string): Promise<PublicIdea[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data: saves } = await supabase
    .from("idea_saves")
    .select("idea_id")
    .eq("profile_id", profileId);

  const ideaIds = [...new Set((saves ?? []).map((save) => save.idea_id))];
  if (ideaIds.length === 0) {
    return [];
  }

  const { data } = await supabase
    .from("ideas")
    .select(IDEA_SELECT)
    .in("id", ideaIds)
    .eq("status", "published")
    .eq("visibility", "public")
    .order("published_at", { ascending: false });

  return attachIdeaMetadata(data ?? []);
}

export async function listInvestorInterests(
  investorId: string,
): Promise<InvestmentInterestWithContext[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("investment_interests")
    .select(
      "id, idea_id, investor_id, creator_id, level, preferred_stage, message, proposed_range, questions, status, created_at, updated_at",
    )
    .eq("investor_id", investorId)
    .order("updated_at", { ascending: false });

  return attachInterestContext(data ?? [], investorId);
}

export async function listCreatorInvestmentInterests(
  creatorId: string,
): Promise<InvestmentInterestWithContext[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("investment_interests")
    .select(
      "id, idea_id, investor_id, creator_id, level, preferred_stage, message, proposed_range, questions, status, created_at, updated_at",
    )
    .eq("creator_id", creatorId)
    .order("updated_at", { ascending: false });

  return attachInterestContext(data ?? [], creatorId);
}

export async function listProfileConnections(
  profileId: string,
): Promise<ConnectionWithContext[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("connections")
    .select(
      "id, requester_id, addressee_id, idea_id, status, message, responded_at, created_at, updated_at",
    )
    .or(`requester_id.eq.${profileId},addressee_id.eq.${profileId}`)
    .order("updated_at", { ascending: false });

  const connections = data ?? [];
  if (connections.length === 0) {
    return [];
  }

  const profileIds = [
    ...new Set(
      connections.flatMap((connection) => [
        connection.requester_id,
        connection.addressee_id,
      ]),
    ),
  ];
  const ideaIds = [
    ...new Set(
      connections
        .map((connection) => connection.idea_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const [profileNames, ideaTitles] = await Promise.all([
    getProfileNames(profileIds),
    getIdeaTitles(ideaIds),
  ]);

  return connections.map((connection) => {
    const otherId =
      connection.requester_id === profileId
        ? connection.addressee_id
        : connection.requester_id;
    const idea = connection.idea_id
      ? ideaTitles.get(connection.idea_id)
      : undefined;

    return {
      ...connection,
      addresseeName:
        profileNames.get(connection.addressee_id) ?? "SparkHub member",
      ideaSlug: idea?.slug ?? null,
      ideaTitle: idea?.title ?? null,
      otherName: profileNames.get(otherId) ?? "SparkHub member",
      requesterName:
        profileNames.get(connection.requester_id) ?? "SparkHub member",
    };
  });
}

export async function getInvestorProfile(profileId: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("investor_profiles")
    .select(
      "profile_id, investor_type, bio, sectors, preferred_stages, location_preference, years_experience, portfolio_visibility, investment_history_visibility, public_investment_count, active_interest_count, created_at, updated_at",
    )
    .eq("profile_id", profileId)
    .maybeSingle();

  return data;
}

export async function getMentorProfile(profileId: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("mentor_profiles")
    .select(
      "profile_id, expertise, bio, availability, visibility, created_at, updated_at",
    )
    .eq("profile_id", profileId)
    .maybeSingle();

  return data;
}

export async function getCreatorIdea(id: string, creatorId: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("ideas")
    .select(IDEA_SELECT)
    .eq("id", id)
    .eq("creator_id", creatorId)
    .maybeSingle();

  return data;
}

export async function listIdeaComments(ideaId: string): Promise<IdeaComment[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("comments")
    .select(
      "id, idea_id, author_id, parent_id, body, is_hidden, created_at, updated_at",
    )
    .eq("idea_id", ideaId)
    .eq("is_hidden", false)
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .limit(20);

  const comments = data ?? [];
  const authorIds = [...new Set(comments.map((comment) => comment.author_id))];
  const authorNames = await getProfileNames(authorIds);

  return comments.map((comment) => ({
    ...comment,
    authorName: authorNames.get(comment.author_id) ?? "SparkHub member",
  }));
}

async function attachIdeaMetadata(ideas: IdeaRow[]): Promise<PublicIdea[]> {
  if (ideas.length === 0) {
    return [];
  }

  const creatorIds = [...new Set(ideas.map((idea) => idea.creator_id))];
  const categoryIds = [
    ...new Set(
      ideas
        .map((idea) => idea.category_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const [creatorNames, categoryNames, engagementEntries] = await Promise.all([
    getProfileNames(creatorIds),
    getCategoryNames(categoryIds),
    Promise.all(ideas.map((idea) => getIdeaEngagement(idea.id))),
  ]);

  return ideas.map((idea, index) => ({
    ...idea,
    creatorName: creatorNames.get(idea.creator_id) ?? "SparkHub creator",
    categoryName: idea.category_id
      ? (categoryNames.get(idea.category_id) ?? null)
      : null,
    engagement: engagementEntries[index] ?? emptyEngagement(),
  }));
}

async function attachInterestContext(
  interests: InvestmentInterestRow[],
  viewerId: string,
): Promise<InvestmentInterestWithContext[]> {
  if (interests.length === 0 || !isSupabaseConfigured()) {
    return [];
  }

  const ideaIds = [...new Set(interests.map((interest) => interest.idea_id))];
  const profileIds = [
    ...new Set(
      interests.flatMap((interest) => [
        interest.creator_id,
        interest.investor_id,
      ]),
    ),
  ];

  const [ideaTitles, profileNames, connections] = await Promise.all([
    getIdeaTitles(ideaIds),
    getProfileNames(profileIds),
    getConnectionsForIdeas(viewerId, ideaIds),
  ]);

  return interests.map((interest) => {
    const idea = ideaTitles.get(interest.idea_id);
    const connection = connections.find(
      (candidate) =>
        candidate.idea_id === interest.idea_id &&
        ((candidate.requester_id === interest.investor_id &&
          candidate.addressee_id === interest.creator_id) ||
          (candidate.requester_id === interest.creator_id &&
            candidate.addressee_id === interest.investor_id)),
    );

    return {
      ...interest,
      connectionAddresseeId: connection?.addressee_id ?? null,
      connectionId: connection?.id ?? null,
      connectionRequesterId: connection?.requester_id ?? null,
      connectionStatus: connection?.status ?? null,
      creatorName: profileNames.get(interest.creator_id) ?? "SparkHub creator",
      ideaSlug: idea?.slug ?? null,
      ideaTitle: idea?.title ?? "SparkHub idea",
      investorName:
        profileNames.get(interest.investor_id) ?? "SparkHub investor",
    };
  });
}

async function getConnectionsForIdeas(profileId: string, ideaIds: string[]) {
  if (ideaIds.length === 0 || !isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("connections")
    .select(
      "id, requester_id, addressee_id, idea_id, status, message, responded_at, created_at, updated_at",
    )
    .in("idea_id", ideaIds)
    .or(`requester_id.eq.${profileId},addressee_id.eq.${profileId}`);

  return data ?? [];
}

async function getIdeaTitles(ideaIds: string[]) {
  const ideas = new Map<string, { slug: string; title: string }>();

  if (ideaIds.length === 0 || !isSupabaseConfigured()) {
    return ideas;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("ideas")
    .select("id, title, slug")
    .in("id", ideaIds);

  for (const idea of data ?? []) {
    ideas.set(idea.id, { slug: idea.slug, title: idea.title });
  }

  return ideas;
}

async function getProfileNames(profileIds: string[]) {
  const names = new Map<string, string>();

  if (profileIds.length === 0 || !isSupabaseConfigured()) {
    return names;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", profileIds);

  for (const profile of data ?? []) {
    names.set(profile.id, profile.display_name);
  }

  return names;
}

async function getCategoryNames(categoryIds: string[]) {
  const names = new Map<string, string>();

  if (categoryIds.length === 0 || !isSupabaseConfigured()) {
    return names;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name")
    .in("id", categoryIds);

  for (const category of data ?? []) {
    names.set(category.id, category.name);
  }

  return names;
}

async function getIdeaEngagement(ideaId: string): Promise<IdeaEngagement> {
  if (!isSupabaseConfigured()) {
    return emptyEngagement();
  }

  const supabase = await createSupabaseServerClient();
  const [likes, saves, followers, comments, shares] = await Promise.all([
    countRows("idea_likes", ideaId),
    countRows("idea_saves", ideaId),
    countRows("idea_followers", ideaId),
    countRows("comments", ideaId),
    countRows("idea_shares", ideaId),
  ]);

  return { likes, saves, followers, comments, shares };

  async function countRows(
    table:
      | "idea_likes"
      | "idea_saves"
      | "idea_followers"
      | "comments"
      | "idea_shares",
    targetIdeaId: string,
  ) {
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("idea_id", targetIdeaId);

    return count ?? 0;
  }
}

function emptyEngagement(): IdeaEngagement {
  return {
    likes: 0,
    saves: 0,
    followers: 0,
    comments: 0,
    shares: 0,
  };
}
