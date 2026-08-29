import type { ProfileRole } from "@/lib/supabase/database.types";

export const SELF_SELECTABLE_ROLES = [
  "idea_poster",
  "investor",
  "mentor",
] as const;

export type SelfSelectableRole = (typeof SELF_SELECTABLE_ROLES)[number];

export const ROLE_LABELS: Record<ProfileRole, string> = {
  idea_poster: "Idea Poster",
  investor: "Investor",
  mentor: "Mentor",
  admin: "Admin",
};

export const ROLE_HOME: Record<ProfileRole, string> = {
  idea_poster: "/app/idea-poster",
  investor: "/app/investor",
  mentor: "/app/mentor",
  admin: "/app/admin",
};

export const ROLE_WORKFLOWS: Record<ProfileRole, string[]> = {
  idea_poster: [
    "Dashboard",
    "My Ideas",
    "Create",
    "Engagement",
    "Investors",
    "Collaborations",
    "Mentors",
  ],
  investor: [
    "Dashboard",
    "Discover",
    "Watchlist",
    "Investment Interests",
    "Connections",
    "Portfolio",
    "Profile",
  ],
  mentor: [
    "Dashboard",
    "Expertise",
    "Discover",
    "Mentorship Requests",
    "Mentees",
    "Profile",
  ],
  admin: [
    "Dashboard",
    "Users",
    "Ideas",
    "Investors",
    "Investments/Interests",
    "Reports",
    "Moderation",
    "Analytics",
  ],
};

export const ROLE_DESCRIPTIONS: Record<ProfileRole, string> = {
  idea_poster:
    "Create ideas, track engagement, meet investors, and manage collaborations.",
  investor:
    "Discover ideas, create investment interests, connect with founders, and track portfolio items.",
  mentor:
    "Offer expertise, review promising ideas, and manage mentorship relationships.",
  admin:
    "Operate the platform, review reports, moderate records, and inspect analytics.",
};
