import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
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
            text="This page is ready for Phase 7 investment interest records. Engagement signals from Phase 5 remain separate."
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
                  Investor record: {interest.investor_id}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
