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
