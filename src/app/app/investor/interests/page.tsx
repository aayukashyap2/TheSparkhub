import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
import { InvestmentInterestCard } from "@/components/app/investment-interest-card";
import { requireRole } from "@/lib/auth/session";
import { listInvestorInterests } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function InvestorInterestsPage() {
  const { user, profile } = await requireRole("investor");
  const interests = await listInvestorInterests(user.id);

  return (
    <AppShell
      active="Investment Interests"
      displayName={profile.display_name}
      role="investor"
    >
      <AppPageHeader
        description="Investment interests are their own records. They are not investments and do not imply a financial transaction."
        eyebrow="Investment interests"
        title="Manage explicit interest separately."
      />
      <div className="mt-8">
        {interests.length === 0 ? (
          <EmptyWorkflow
            href="/app/investor/discover"
            linkLabel="Discover ideas"
            text="Create an explicit interest from any public idea before requesting a connection with the creator."
            title="No investment interests yet"
          />
        ) : (
          <div className="grid gap-3">
            {interests.map((interest) => (
              <InvestmentInterestCard
                interest={interest}
                key={interest.id}
                mode="investor"
                returnTo="/app/investor/interests"
                viewerId={user.id}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
