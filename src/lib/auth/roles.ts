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

export const ROLE_NAV_ITEMS: Record<
  ProfileRole,
  Array<{ label: string; href: string }>
> = {
  idea_poster: [
    { label: "Dashboard", href: "/app/idea-poster" },
    { label: "My Ideas", href: "/app/idea-poster/ideas" },
    { label: "Create", href: "/app/idea-poster/ideas/new" },
    { label: "Engagement", href: "/app/idea-poster/engagement" },
    { label: "Investors", href: "/app/idea-poster/investors" },
    { label: "Collaborations", href: "/app/idea-poster/collaborations" },
    { label: "Mentors", href: "/app/idea-poster/mentors" },
  ],
  investor: [
    { label: "Dashboard", href: "/app/investor" },
    { label: "Discover", href: "/app/investor/discover" },
    { label: "Watchlist", href: "/app/investor/watchlist" },
    { label: "Investment Interests", href: "/app/investor/interests" },
    { label: "Connections", href: "/app/investor/connections" },
    { label: "Portfolio", href: "/app/investor/portfolio" },
    { label: "Profile", href: "/app/investor/profile" },
  ],
  mentor: [
    { label: "Dashboard", href: "/app/mentor" },
    { label: "Expertise", href: "/app/mentor/profile" },
    { label: "Discover", href: "/app/mentor/discover" },
    { label: "Mentorship Requests", href: "/app/mentor/requests" },
    { label: "Mentees", href: "/app/mentor/mentees" },
    { label: "Profile", href: "/app/mentor/profile" },
  ],
  admin: [
    { label: "Dashboard", href: "/app/admin" },
    { label: "Users", href: "#" },
    { label: "Ideas", href: "#" },
    { label: "Investors", href: "#" },
    { label: "Investments/Interests", href: "#" },
    { label: "Reports", href: "#" },
    { label: "Moderation", href: "#" },
    { label: "Analytics", href: "#" },
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
