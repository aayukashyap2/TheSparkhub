import { AppPageHeader, AppShell, MetricCard } from "@/components/app/app-shell";
import { requireRole } from "@/lib/auth/session";
import { getInvestorProfile } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function InvestorProfilePage() {
  const { user, profile } = await requireRole("investor");
  const investorProfile = await getInvestorProfile(user.id);

  return (
    <AppShell active="Profile" displayName={profile.display_name} role="investor">
      <AppPageHeader
        description="Investor profile data guides discovery and future matching without replacing the explicit interest workflow."
        eyebrow="Investor profile"
        title="Your investor context"
      />
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Sectors"
          value={investorProfile?.sectors.length ?? 0}
          tone="green"
        />
        <MetricCard
          label="Preferred stages"
          value={investorProfile?.preferred_stages.length ?? 0}
          tone="blue"
        />
        <MetricCard
          label="Active interests"
          value={investorProfile?.active_interest_count ?? 0}
          tone="amber"
        />
      </div>
      <div className="mt-8 rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-5">
        <h2 className="text-xl font-semibold">Profile summary</h2>
        <p className="mt-3 text-sm leading-6 text-[#60716b]">
          {investorProfile?.bio ??
            "Investor onboarding has created the profile record. Rich profile editing comes in a later pass."}
        </p>
      </div>
    </AppShell>
  );
}
