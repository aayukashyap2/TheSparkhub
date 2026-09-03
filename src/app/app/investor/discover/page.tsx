import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { IdeaList } from "@/components/ideas/idea-list";
import { requireRole } from "@/lib/auth/session";
import { listPublicIdeas } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function InvestorDiscoverPage() {
  const { profile } = await requireRole("investor");
  const ideas = await listPublicIdeas();

  return (
    <AppShell active="Discover" displayName={profile.display_name} role="investor">
      <AppPageHeader
        description="Review public ideas, save the ones you want to track, then open a clear interest record when a conversation is worth starting."
        eyebrow="Discover"
        title="Find ideas that match your thesis."
      />
      <div className="mt-8">
        <IdeaList
          emptyText="Published public ideas will appear here as creators launch them."
          emptyTitle="No public ideas to review yet"
          ideas={ideas}
        />
      </div>
    </AppShell>
  );
}
