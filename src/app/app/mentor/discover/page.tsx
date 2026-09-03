import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { IdeaList } from "@/components/ideas/idea-list";
import { requireRole } from "@/lib/auth/session";
import { listPublicIdeas } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function MentorDiscoverPage() {
  const { profile } = await requireRole("mentor");
  const ideas = await listPublicIdeas();

  return (
    <AppShell active="Discover" displayName={profile.display_name} role="mentor">
      <AppPageHeader
        description="Find public ideas where your expertise can help creators improve clarity, execution, or market readiness."
        eyebrow="Discover"
        title="Match expertise to promising ideas."
      />
      <div className="mt-8">
        <IdeaList
          emptyText="Published ideas will appear here as creators launch them."
          emptyTitle="No ideas available for mentorship yet"
          ideas={ideas}
        />
      </div>
    </AppShell>
  );
}
