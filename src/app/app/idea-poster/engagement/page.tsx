import Link from "next/link";
import { AppPageHeader, AppShell, MetricCard } from "@/components/app/app-shell";
import { requireRole } from "@/lib/auth/session";
import { listCreatorIdeas } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function IdeaPosterEngagementPage() {
  const { user, profile } = await requireRole("idea_poster");
  const ideas = await listCreatorIdeas(user.id);
  const totals = ideas.reduce(
    (sum, idea) => ({
      likes: sum.likes + idea.engagement.likes,
      saves: sum.saves + idea.engagement.saves,
      followers: sum.followers + idea.engagement.followers,
      comments: sum.comments + idea.engagement.comments,
      shares: sum.shares + idea.engagement.shares,
    }),
    { likes: 0, saves: 0, followers: 0, comments: 0, shares: 0 },
  );

  return (
    <AppShell active="Engagement" displayName={profile.display_name} role="idea_poster">
      <AppPageHeader
        description="Track engagement as feedback and attention signals. These records are not investor interests or investments."
        eyebrow="Engagement"
        title="Understand how people respond to your ideas."
      />
      <div className="mt-8 grid gap-3 md:grid-cols-5">
        <MetricCard label="Likes" value={totals.likes} tone="green" />
        <MetricCard label="Saves" value={totals.saves} tone="blue" />
        <MetricCard label="Followers" value={totals.followers} tone="amber" />
        <MetricCard label="Comments" value={totals.comments} tone="green" />
        <MetricCard label="Shares" value={totals.shares} tone="blue" />
      </div>
      <div className="mt-8 grid gap-3">
        {ideas.length === 0 ? (
          <article className="rounded-lg border border-dashed border-[#bdccc6] bg-[#fbfcfb] p-6">
            <h2 className="text-2xl font-semibold">No idea engagement yet</h2>
            <p className="mt-3 text-sm leading-6 text-[#60716b]">
              Create and publish an idea before engagement can appear.
            </p>
            <Link
              className="mt-5 inline-flex rounded-lg bg-[#1f7a5a] px-4 py-2 text-sm font-semibold text-white"
              href="/app/idea-poster/ideas/new"
            >
              Create idea
            </Link>
          </article>
        ) : (
          ideas.map((idea) => (
            <article
              className="rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-4"
              key={idea.id}
            >
              <h2 className="text-lg font-semibold">{idea.title}</h2>
              <p className="mt-2 text-sm text-[#60716b]">
                {idea.engagement.likes} likes, {idea.engagement.saves} saves,{" "}
                {idea.engagement.followers} follows, {idea.engagement.comments} comments.
              </p>
            </article>
          ))
        )}
      </div>
    </AppShell>
  );
}
