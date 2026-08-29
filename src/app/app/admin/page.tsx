import { RoleDashboard } from "@/components/app/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { profile } = await requireRole("admin");

  return <RoleDashboard role="admin" displayName={profile.display_name} />;
}
