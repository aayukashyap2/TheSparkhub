import Link from "next/link";
import { AppPageHeader, AppShell, MetricCard } from "@/components/app/app-shell";
import { requireRole } from "@/lib/auth/session";
import {
  listInvestorInterests,
  listPublicIdeas,
  listSavedIdeas,
} from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function InvestorDashboardPage() {
  const { user, profile } = await requireRole("investor");
  const [publicIdeas, savedIdeas, interests] = await Promise.all([
    listPublicIdeas(6),
    listSavedIdeas(user.id),
    listInvestorInterests(user.id),
  ]);

  return (
    <AppShell active="Dashboard" displayName={profile.display_name} role="investor">
      <AppPageHeader
        description="Discover public ideas, build a watchlist, and track investment interests as their own records before any connection or portfolio step."
        eyebrow="Investor workspace"
        title={`Welcome, ${profile.display_name}`}
        action={
          <Link
            className="inline-flex rounded-lg bg-[#1f7a5a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16664a]"
            href="/app/investor/discover"
          >
            Discover ideas
          </Link>
        }
      />
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <MetricCard label="Public ideas to review" value={publicIdeas.length} tone="green" />
        <MetricCard label="Watchlist items" value={savedIdeas.length} tone="blue" />
        <MetricCard label="Investment interests" value={interests.length} tone="amber" />
      </div>
      <div className="mt-8 rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-5">
        <h2 className="text-xl font-semibold">Investor journey</h2>
        <div className="mt-5 grid gap-2 sm:grid-cols-5">
          {["Discover", "Watchlist", "Interest", "Connection", "Portfolio"].map(
            (step) => (
              <div
                className="rounded-lg border border-[#dfe5e1] bg-white p-3 text-sm font-semibold text-[#263b35]"
                key={step}
              >
                {step}
              </div>
            ),
          )}
        </div>
        <p className="mt-4 text-sm leading-6 text-[#60716b]">
          Phase 6 gives investors a real workspace shape. Phase 7 will add the
          investment interest and connection creation workflow.
        </p>
      </div>
    </AppShell>
  );
}
