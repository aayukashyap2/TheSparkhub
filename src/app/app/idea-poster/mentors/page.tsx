import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function IdeaPosterMentorsPage() {
  const { profile } = await requireRole("idea_poster");

  return (
    <AppShell active="Mentors" displayName={profile.display_name} role="idea_poster">
      <AppPageHeader
        description="Mentorship is its own support path for strengthening ideas before investor workflows."
        eyebrow="Mentors"
        title="Find guidance without turning it into funding."
      />
      <div className="mt-8">
        <EmptyWorkflow
          href="/app/idea-poster/ideas"
          linkLabel="Review your ideas"
          text="Mentor discovery and requests will use idea context, but they will remain separate from investment interests."
          title="No mentor relationships yet"
        />
      </div>
    </AppShell>
  );
}
