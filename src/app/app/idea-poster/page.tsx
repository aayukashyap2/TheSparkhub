import { RoleDashboard } from "@/components/app/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function IdeaPosterDashboardPage() {
  const { profile } = await requireRole("idea_poster");

  return (
    <RoleDashboard role="idea_poster" displayName={profile.display_name} />
  );
}
