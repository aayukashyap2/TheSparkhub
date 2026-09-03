import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function MentorMenteesPage() {
  const { profile } = await requireRole("mentor");

  return (
    <AppShell active="Mentees" displayName={profile.display_name} role="mentor">
      <AppPageHeader
        description="Accepted mentorship relationships will live here as ongoing founder support."
        eyebrow="Mentees"
        title="Track founders you are actively helping."
      />
      <div className="mt-8">
        <EmptyWorkflow
          href="/app/mentor/requests"
          linkLabel="View requests"
          text="This page is ready for accepted mentorship relationships once the collaboration workflow is expanded."
          title="No active mentees yet"
        />
      </div>
    </AppShell>
  );
}
