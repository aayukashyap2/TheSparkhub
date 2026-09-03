import { AppPageHeader, AppShell } from "@/components/app/app-shell";
import { EmptyWorkflow } from "@/components/app/empty-workflow";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function IdeaPosterCollaborationsPage() {
  const { profile } = await requireRole("idea_poster");

  return (
    <AppShell
      active="Collaborations"
      displayName={profile.display_name}
      role="idea_poster"
    >
      <AppPageHeader
        description="Collaboration requests and accepted collaborators will become their own workflow, separate from funding."
        eyebrow="Collaborations"
        title="Build with people before deals."
      />
      <div className="mt-8">
        <EmptyWorkflow
          href="/app/idea-poster/ideas"
          linkLabel="Manage ideas"
          text="The collaboration request flow will connect to published ideas in a later phase."
          title="No collaborations yet"
        />
      </div>
    </AppShell>
  );
}
