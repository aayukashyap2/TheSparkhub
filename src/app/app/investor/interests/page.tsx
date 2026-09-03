import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
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
            text="Phase 7 will add the action that creates investment interest records. This page is ready to display those records once they exist."
            title="No investment interests yet"
          />
        ) : (
          <div className="grid gap-3">
            {interests.map((interest) => (
              <article
                className="rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-4"
                key={interest.id}
              >
                <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
                  {interest.status}
                </p>
                <h2 className="mt-2 text-lg font-semibold">
                  Interest level: {interest.level}
                </h2>
                <p className="mt-2 text-sm text-[#60716b]">
                  Idea record: {interest.idea_id}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
