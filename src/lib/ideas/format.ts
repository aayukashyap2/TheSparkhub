import type { IdeaStage, IdeaStatus } from "@/lib/supabase/database.types";

export const IDEA_STAGE_LABELS: Record<IdeaStage, string> = {
  idea: "Idea",
  prototype: "Prototype",
  mvp: "MVP",
  early_traction: "Early traction",
  growth: "Growth",
};

export const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 64);
}

export function formatDate(value: string | null) {
  if (!value) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
