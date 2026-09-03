import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
import { InvestmentInterestCard } from "@/components/app/investment-interest-card";
import { requireRole } from "@/lib/auth/session";
import { listCreatorInvestmentInterests } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function IdeaPosterInvestorsPage() {
  const { user, profile } = await requireRole("idea_poster");
  const interests = await listCreatorInvestmentInterests(user.id);

  return (
    <AppShell active="Investors" displayName={profile.display_name} role="idea_poster">
      <AppPageHeader
        description="Investor signals are shown here only after explicit investment interest records exist."
        eyebrow="Investors"
        title="Review investor interest without jumping to investment."
      />
      <div className="mt-8">
        {interests.length === 0 ? (
          <EmptyWorkflow
            href="/app/idea-poster/ideas"
            linkLabel="Manage ideas"
            text="Investor interest will appear here after someone creates an explicit interest record from a published idea."
            title="No investment interests yet"
          />
        ) : (
          <div className="grid gap-3">
            {interests.map((interest) => (
              <InvestmentInterestCard
                interest={interest}
                key={interest.id}
                mode="creator"
                returnTo="/app/idea-poster/investors"
                viewerId={user.id}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
