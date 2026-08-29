import { RoleDashboard } from "@/components/app/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function MentorDashboardPage() {
  const { profile } = await requireRole("mentor");

  return <RoleDashboard role="mentor" displayName={profile.display_name} />;
}
