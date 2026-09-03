import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function InvestorPortfolioPage() {
  const { profile } = await requireRole("investor");

  return (
    <AppShell active="Portfolio" displayName={profile.display_name} role="investor">
      <AppPageHeader
        description="Portfolio items come after explicit investment records, never from a simple interested click."
        eyebrow="Portfolio"
        title="Portfolio stays downstream of real investments."
      />
      <div className="mt-8">
        <EmptyWorkflow
          href="/app/investor/interests"
          linkLabel="Review interests"
          text="SparkHub will only create portfolio records after the investment workflow has enough deliberate information to support them."
          title="No portfolio records yet"
        />
      </div>
    </AppShell>
  );
}
