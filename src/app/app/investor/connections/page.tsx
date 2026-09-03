import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function InvestorConnectionsPage() {
  const { profile } = await requireRole("investor");

  return (
    <AppShell active="Connections" displayName={profile.display_name} role="investor">
      <AppPageHeader
        description="Accepted creator relationships will live here after the interest and connection flow is implemented."
        eyebrow="Connections"
        title="Conversations need mutual context."
      />
      <div className="mt-8">
        <EmptyWorkflow
          href="/app/investor/interests"
          linkLabel="View interests"
          text="Connections are deliberately separate from watchlists and interests. Phase 7 will introduce request and acceptance states."
          title="No investor connections yet"
        />
      </div>
    </AppShell>
  );
}
