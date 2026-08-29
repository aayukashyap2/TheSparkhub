import { RoleDashboard } from "@/components/app/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function InvestorDashboardPage() {
  const { profile } = await requireRole("investor");

  return <RoleDashboard role="investor" displayName={profile.display_name} />;
}
