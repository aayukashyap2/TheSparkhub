import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { IdeaList } from "@/components/ideas/idea-list";
import { requireRole } from "@/lib/auth/session";
import { listSavedIdeas } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function InvestorWatchlistPage() {
  const { user, profile } = await requireRole("investor");
  const ideas = await listSavedIdeas(user.id);

  return (
    <AppShell active="Watchlist" displayName={profile.display_name} role="investor">
      <AppPageHeader
        description="Saved ideas live here as a watchlist. This is intentionally lighter than investment interest."
        eyebrow="Watchlist"
        title="Track ideas before taking a stronger step."
      />
      <div className="mt-8">
        <IdeaList
          emptyText="Save public ideas from an idea detail page to start your watchlist."
          emptyTitle="Your watchlist is empty"
          ideas={ideas}
        />
      </div>
    </AppShell>
  );
}
