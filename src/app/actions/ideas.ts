"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireOnboardedUser, requireRole } from "@/lib/auth/session";
import { slugify } from "@/lib/ideas/format";
import { getCreatorIdea } from "@/lib/ideas/queries";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  IdeaStage,
  IdeaStatus,
  IdeaVisibility,
  VisibilityLevel,
} from "@/lib/supabase/database.types";

export type IdeaFormState = {
  status: "idle" | "error";
  message?: string;
};

const ideaStages = [
  "idea",
  "prototype",
  "mvp",
  "early_traction",
  "growth",
] as const;

const ideaVisibilities = ["public", "unlisted", "private"] as const;

const IdeaFormSchema = z.object({
  title: z.string().trim().min(4, "Add a clear idea title.").max(96),
  summary: z.string().trim().min(20, "Write a sharper summary.").max(320),
  problem: z.string().trim().max(1200).optional(),
  solution: z.string().trim().max(1200).optional(),
  targetUsers: z.string().trim().max(600).optional(),
  technology: z.string().trim().max(600).optional(),
  marketImpact: z.string().trim().max(800).optional(),
  stage: z.enum(ideaStages),
  visibility: z.enum(ideaVisibilities),
  seekingFunding: z.boolean(),
  fundingGoal: z.number().nonnegative().nullable(),
  fundingCurrency: z.string().trim().length(3).toUpperCase().default("INR"),
  useOfFunds: z.string().trim().max(800).optional(),
  categoryId: z.string().uuid().nullable(),
  intent: z.enum(["draft", "publish"]),
});

const CommentSchema = z.object({
  ideaId: z.string().uuid(),
  slug: z.string().min(1),
  body: z.string().trim().min(2, "Write a comment first.").max(800),
});

const InvestmentInterestSchema = z.object({
  ideaId: z.string().uuid(),
  slug: z.string().min(1),
  level: z.enum(["low", "medium", "high"]).default("medium"),
  message: z.string().trim().max(700).optional(),
  proposedRange: z.string().trim().max(120).optional(),
  questions: z.string().trim().max(700).optional(),
});

const ConnectionRequestSchema = z.object({
  interestId: z.string().uuid(),
  message: z.string().trim().max(700).optional(),
  returnTo: z.string().optional(),
});

const ConnectionResponseSchema = z.object({
  connectionId: z.string().uuid(),
  response: z.enum(["accepted", "declined"]),
  returnTo: z.string().optional(),
});

const IdSchema = z.object({
  ideaId: z.string().uuid(),
  slug: z.string().optional(),
});

function errorState(message: string): IdeaFormState {
  return { status: "error", message };
}

function fieldString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseFundingGoal(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function safeReturnPath(value: string | undefined, fallback: string) {
  if (!value?.startsWith("/app/")) {
    return fallback;
  }

  return value;
}

function parseIdeaForm(formData: FormData) {
  return IdeaFormSchema.safeParse({
    title: fieldString(formData, "title"),
    summary: fieldString(formData, "summary"),
    problem: fieldString(formData, "problem"),
    solution: fieldString(formData, "solution"),
    targetUsers: fieldString(formData, "targetUsers"),
    technology: fieldString(formData, "technology"),
    marketImpact: fieldString(formData, "marketImpact"),
    stage: fieldString(formData, "stage"),
    visibility: fieldString(formData, "visibility"),
    seekingFunding: formData.get("seekingFunding") === "on",
    fundingGoal: parseFundingGoal(fieldString(formData, "fundingGoal")),
    fundingCurrency: fieldString(formData, "fundingCurrency") || "INR",
    useOfFunds: fieldString(formData, "useOfFunds"),
    categoryId: fieldString(formData, "categoryId") || null,
    intent: fieldString(formData, "intent"),
  });
}

export async function createIdeaAction(
  _state: IdeaFormState,
  formData: FormData,
): Promise<IdeaFormState> {
  if (!isSupabaseConfigured()) {
    return errorState("Supabase keys are not configured in .env.local yet.");
  }

  const parsed = parseIdeaForm(formData);
  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Check the form.");
  }

  const { user } = await requireRole("idea_poster");
  const supabase = await createSupabaseServerClient();
  const status: IdeaStatus =
    parsed.data.intent === "publish" ? "published" : "draft";
  const visibility: IdeaVisibility =
    status === "published" ? parsed.data.visibility : "private";
  const slugBase = slugify(parsed.data.title) || "sparkhub-idea";
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from("ideas")
    .insert({
      creator_id: user.id,
      category_id: parsed.data.categoryId,
      title: parsed.data.title,
      slug,
      summary: parsed.data.summary,
      problem: optionalText(parsed.data.problem ?? ""),
      solution: optionalText(parsed.data.solution ?? ""),
      target_users: optionalText(parsed.data.targetUsers ?? ""),
      technology: optionalText(parsed.data.technology ?? ""),
      market_impact: optionalText(parsed.data.marketImpact ?? ""),
      stage: parsed.data.stage as IdeaStage,
      status,
      visibility,
      seeking_funding: parsed.data.seekingFunding,
      funding_goal: parsed.data.fundingGoal,
      funding_currency: parsed.data.fundingCurrency,
      funding_visibility: "private" as VisibilityLevel,
      use_of_funds: optionalText(parsed.data.useOfFunds ?? ""),
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id, slug")
    .single();

  if (error || !data) {
    return errorState(error?.message ?? "Unable to create idea.");
  }

  await supabase.from("idea_members").insert({
    idea_id: data.id,
    profile_id: user.id,
    role: "owner",
  });

  revalidatePath("/ideas");
  revalidatePath("/explore");
  revalidatePath("/app/idea-poster");
  revalidatePath("/app/idea-poster/ideas");

  redirect(`/app/idea-poster/ideas/${data.id}/edit`);
}

export async function updateIdeaAction(
  _state: IdeaFormState,
  formData: FormData,
): Promise<IdeaFormState> {
  if (!isSupabaseConfigured()) {
    return errorState("Supabase keys are not configured in .env.local yet.");
  }

  const ideaId = fieldString(formData, "ideaId");
  const parsedId = z.string().uuid().safeParse(ideaId);
  if (!parsedId.success) {
    return errorState("Idea record is missing.");
  }

  const parsed = parseIdeaForm(formData);
  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Check the form.");
  }

  const { user } = await requireRole("idea_poster");
  const existing = await getCreatorIdea(parsedId.data, user.id);

  if (!existing) {
    return errorState("You can only edit your own ideas.");
  }

  const supabase = await createSupabaseServerClient();
  const status: IdeaStatus =
    parsed.data.intent === "publish" ? "published" : existing.status;
  const visibility: IdeaVisibility =
    status === "published" ? parsed.data.visibility : "private";

  const { error } = await supabase
    .from("ideas")
    .update({
      category_id: parsed.data.categoryId,
      title: parsed.data.title,
      summary: parsed.data.summary,
      problem: optionalText(parsed.data.problem ?? ""),
      solution: optionalText(parsed.data.solution ?? ""),
      target_users: optionalText(parsed.data.targetUsers ?? ""),
      technology: optionalText(parsed.data.technology ?? ""),
      market_impact: optionalText(parsed.data.marketImpact ?? ""),
      stage: parsed.data.stage as IdeaStage,
      status,
      visibility,
      seeking_funding: parsed.data.seekingFunding,
      funding_goal: parsed.data.fundingGoal,
      funding_currency: parsed.data.fundingCurrency,
      use_of_funds: optionalText(parsed.data.useOfFunds ?? ""),
      published_at:
        status === "published" && !existing.published_at
          ? new Date().toISOString()
          : existing.published_at,
    })
    .eq("id", parsedId.data)
    .eq("creator_id", user.id);

  if (error) {
    return errorState(error.message);
  }

  revalidatePath("/ideas");
  revalidatePath("/explore");
  revalidatePath(`/ideas/${existing.slug}`);
  revalidatePath("/app/idea-poster");
  revalidatePath("/app/idea-poster/ideas");
  revalidatePath(`/app/idea-poster/ideas/${parsedId.data}/edit`);

  redirect(`/app/idea-poster/ideas/${parsedId.data}/edit?updated=1`);
}

export async function archiveIdeaAction(formData: FormData) {
  const { user } = await requireRole("idea_poster");
  const parsed = IdSchema.safeParse({ ideaId: formData.get("ideaId") });

  if (!parsed.success) {
    redirect("/app/idea-poster/ideas");
  }

  const existing = await getCreatorIdea(parsed.data.ideaId, user.id);
  if (!existing) {
    redirect("/app/idea-poster/ideas");
  }

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("ideas")
    .update({
      status: "archived",
      visibility: "private",
    })
    .eq("id", parsed.data.ideaId)
    .eq("creator_id", user.id);

  revalidatePath("/ideas");
  revalidatePath("/explore");
  revalidatePath(`/ideas/${existing.slug}`);
  revalidatePath("/app/idea-poster");
  revalidatePath("/app/idea-poster/ideas");

  redirect("/app/idea-poster/ideas");
}

export async function toggleIdeaSignalAction(formData: FormData) {
  const { user } = await requireOnboardedUser();
  const parsed = IdSchema.extend({
    signal: z.enum(["like", "save", "follow"]),
  }).safeParse({
    ideaId: formData.get("ideaId"),
    slug: formData.get("slug"),
    signal: formData.get("signal"),
  });

  if (!parsed.success) {
    redirect("/ideas");
  }

  const tableBySignal = {
    like: "idea_likes",
    save: "idea_saves",
    follow: "idea_followers",
  } as const;

  const table = tableBySignal[parsed.data.signal];
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from(table)
    .select("idea_id")
    .eq("idea_id", parsed.data.ideaId)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from(table)
      .delete()
      .eq("idea_id", parsed.data.ideaId)
      .eq("profile_id", user.id);
  } else {
    await supabase.from(table).insert({
      idea_id: parsed.data.ideaId,
      profile_id: user.id,
    });
  }

  revalidatePath("/ideas");
  revalidatePath("/explore");
  if (parsed.data.slug) {
    revalidatePath(`/ideas/${parsed.data.slug}`);
    redirect(`/ideas/${parsed.data.slug}`);
  }

  redirect("/ideas");
}

export async function addCommentAction(
  _state: IdeaFormState,
  formData: FormData,
): Promise<IdeaFormState> {
  const { user } = await requireOnboardedUser();
  const parsed = CommentSchema.safeParse({
    ideaId: formData.get("ideaId"),
    slug: formData.get("slug"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Check the comment.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("comments").insert({
    idea_id: parsed.data.ideaId,
    author_id: user.id,
    body: parsed.data.body,
  });

  if (error) {
    return errorState(error.message);
  }

  revalidatePath(`/ideas/${parsed.data.slug}`);
  redirect(`/ideas/${parsed.data.slug}`);
}

export async function recordShareAction(formData: FormData) {
  const { user } = await requireOnboardedUser();
  const parsed = IdSchema.safeParse({
    ideaId: formData.get("ideaId"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    redirect("/ideas");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.from("idea_shares").insert({
    idea_id: parsed.data.ideaId,
    profile_id: user.id,
    channel: "copy_link",
  });

  revalidatePath(`/ideas/${parsed.data.slug}`);
  redirect(`/ideas/${parsed.data.slug}`);
}

export async function createInvestmentInterestAction(formData: FormData) {
  const parsed = InvestmentInterestSchema.safeParse({
    ideaId: formData.get("ideaId"),
    slug: formData.get("slug"),
    level: formData.get("level") || "medium",
    message: formData.get("message"),
    proposedRange: formData.get("proposedRange"),
    questions: formData.get("questions"),
  });

  if (!parsed.success) {
    redirect("/ideas");
  }

  const { user } = await requireRole("investor");
  const supabase = await createSupabaseServerClient();
  const { data: idea } = await supabase
    .from("ideas")
    .select("id, creator_id, slug, stage, status, visibility")
    .eq("id", parsed.data.ideaId)
    .eq("status", "published")
    .eq("visibility", "public")
    .maybeSingle();

  if (!idea || idea.creator_id === user.id) {
    redirect(`/ideas/${parsed.data.slug}`);
  }

  const interestFields = {
    level: parsed.data.level,
    preferred_stage: idea.stage,
    message: optionalText(parsed.data.message ?? ""),
    proposed_range: optionalText(parsed.data.proposedRange ?? ""),
    questions: optionalText(parsed.data.questions ?? ""),
    status: "interested" as const,
  };

  const { data: existing } = await supabase
    .from("investment_interests")
    .select("id")
    .eq("idea_id", idea.id)
    .eq("investor_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("investment_interests")
      .update(interestFields)
      .eq("id", existing.id)
      .eq("investor_id", user.id);
  } else {
    await supabase.from("investment_interests").insert({
      ...interestFields,
      creator_id: idea.creator_id,
      idea_id: idea.id,
      investor_id: user.id,
    });
  }

  revalidatePath(`/ideas/${parsed.data.slug}`);
  revalidatePath("/app/investor");
  revalidatePath("/app/investor/interests");
  revalidatePath("/app/idea-poster/investors");

  redirect(`/app/investor/interests?interest=${existing ? "updated" : "created"}`);
}

export async function requestConnectionForInterestAction(formData: FormData) {
  const parsed = ConnectionRequestSchema.safeParse({
    interestId: formData.get("interestId"),
    message: formData.get("message"),
    returnTo: formData.get("returnTo"),
  });
  const returnTo = safeReturnPath(parsed.success ? parsed.data.returnTo : undefined, "/app");

  if (!parsed.success) {
    redirect(returnTo);
  }

  const { user } = await requireOnboardedUser();
  const supabase = await createSupabaseServerClient();
  const { data: interest } = await supabase
    .from("investment_interests")
    .select("id, idea_id, investor_id, creator_id, status")
    .eq("id", parsed.data.interestId)
    .maybeSingle();

  const isInvestor = interest?.investor_id === user.id;
  const isCreator = interest?.creator_id === user.id;

  if (!interest || (!isInvestor && !isCreator)) {
    redirect(returnTo);
  }

  const addresseeId = isInvestor ? interest.creator_id : interest.investor_id;
  const { data: existing } = await supabase
    .from("connections")
    .select("id")
    .eq("idea_id", interest.idea_id)
    .or(
      `and(requester_id.eq.${user.id},addressee_id.eq.${addresseeId}),and(requester_id.eq.${addresseeId},addressee_id.eq.${user.id})`,
    )
    .maybeSingle();

  if (!existing) {
    await supabase.from("connections").insert({
      requester_id: user.id,
      addressee_id: addresseeId,
      idea_id: interest.idea_id,
      message: optionalText(parsed.data.message ?? ""),
    });
  }

  if (interest.status === "interested") {
    await supabase
      .from("investment_interests")
      .update({ status: "contacted" })
      .eq("id", interest.id);
  }

  revalidatePath("/app/investor/interests");
  revalidatePath("/app/investor/connections");
  revalidatePath("/app/idea-poster/investors");
  revalidatePath("/app/idea-poster/collaborations");

  redirect(`${returnTo}?connection=${existing ? "exists" : "requested"}`);
}

export async function respondToConnectionAction(formData: FormData) {
  const parsed = ConnectionResponseSchema.safeParse({
    connectionId: formData.get("connectionId"),
    response: formData.get("response"),
    returnTo: formData.get("returnTo"),
  });
  const returnTo = safeReturnPath(parsed.success ? parsed.data.returnTo : undefined, "/app");

  if (!parsed.success) {
    redirect(returnTo);
  }

  const { user } = await requireOnboardedUser();
  const supabase = await createSupabaseServerClient();
  const respondedAt = new Date().toISOString();

  await supabase
    .from("connections")
    .update({
      responded_at: respondedAt,
      status: parsed.data.response,
    })
    .eq("id", parsed.data.connectionId)
    .eq("addressee_id", user.id)
    .eq("status", "pending");

  revalidatePath("/app/investor/interests");
  revalidatePath("/app/investor/connections");
  revalidatePath("/app/idea-poster/investors");
  revalidatePath("/app/idea-poster/collaborations");

  redirect(`${returnTo}?connection=${parsed.data.response}`);
}
