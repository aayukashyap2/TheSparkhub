import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { AppPageHeader, AppShell, MetricCard } from "@/components/app/app-shell";
import { requireRole } from "@/lib/auth/session";
import { listCreatorIdeas } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function IdeaPosterDashboardPage() {
  const { user, profile } = await requireRole("idea_poster");
  const ideas = await listCreatorIdeas(user.id);
  const published = ideas.filter((idea) => idea.status === "published").length;
  const drafts = ideas.filter((idea) => idea.status === "draft").length;
  const totalEngagement = ideas.reduce(
    (sum, idea) =>
      sum +
      idea.engagement.likes +
      idea.engagement.saves +
      idea.engagement.followers +
      idea.engagement.comments +
      idea.engagement.shares,
    0,
  );

  return (
    <AppShell
      active="Dashboard"
      displayName={profile.display_name}
      role="idea_poster"
    >
      <AppPageHeader
        description="Create ideas, publish when ready, and track engagement without mixing it up with investor interest or investment records."
        eyebrow="Idea Poster workspace"
        title={`Welcome, ${profile.display_name}`}
        action={
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16664a]"
            href="/app/idea-poster/ideas/new"
          >
            <Plus aria-hidden="true" size={17} />
            New idea
          </Link>
        }
      />

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <MetricCard label="Total ideas" value={ideas.length} tone="green" />
        <MetricCard label="Published" value={published} tone="blue" />
        <MetricCard
          label="Engagement signals"
          value={totalEngagement}
          tone="amber"
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <article className="rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-5">
          <h2 className="text-xl font-semibold">Idea lifecycle</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-4">
            {["Draft", "Published", "Engagement", "Archive"].map((item) => (
              <div
                className="rounded-lg border border-[#dfe5e1] bg-white p-3 text-sm font-semibold text-[#263b35]"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-[#60716b]">
            Phase 5 covers the idea object and engagement. Investment interests
            remain a later, separate workflow.
          </p>
        </article>
        <article className="rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-5">
          <h2 className="text-xl font-semibold">My Ideas</h2>
          <p className="mt-3 text-sm leading-6 text-[#60716b]">
            Drafts: {drafts}. Published: {published}. Manage your idea pages
            and public discovery status from one place.
          </p>
          <Link
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#cfdad5] px-4 py-2 text-sm font-semibold text-[#263b35] transition hover:border-[#1f7a5a]"
            href="/app/idea-poster/ideas"
          >
            Open my ideas
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </article>
      </div>
    </AppShell>
  );
}
