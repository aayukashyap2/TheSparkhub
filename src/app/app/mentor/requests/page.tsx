import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function MentorRequestsPage() {
  const { profile } = await requireRole("mentor");

  return (
    <AppShell
      active="Mentorship Requests"
      displayName={profile.display_name}
      role="mentor"
    >
      <AppPageHeader
        description="Structured requests will help mentors accept, decline, and track founder support without becoming investment records."
        eyebrow="Requests"
        title="Mentorship requests get their own lane."
      />
      <div className="mt-8">
        <EmptyWorkflow
          href="/app/mentor/discover"
          linkLabel="Discover ideas"
          text="The request workflow will build on collaboration records later. For now, this page establishes the separate mentor surface."
          title="No mentorship requests yet"
        />
      </div>
    </AppShell>
  );
}
