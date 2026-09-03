import Link from "next/link";
import { ArrowRight, BarChart3, Lightbulb, Plus, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
    <main className="min-h-screen bg-[#f6f3ed] text-[#101817]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-5 py-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-[#d8d2c7] bg-[#10231f] p-4 text-white shadow-sm">
          <Link className="block text-lg font-semibold" href="/">
            SparkHub
          </Link>
          <p className="mt-1 text-xs uppercase text-[#9fc2b6]">Idea Poster</p>
          <nav className="mt-8 space-y-1">
            {["Dashboard", "My Ideas", "Create", "Engagement", "Investors", "Collaborations", "Mentors"].map(
              (item, index) => (
                <Link
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    index === 0
                      ? "bg-white text-[#10231f]"
                      : "text-[#d9e7e1] hover:bg-white/10"
                  }`}
                  href={
                    item === "My Ideas"
                      ? "/app/idea-poster/ideas"
                      : item === "Create"
                        ? "/app/idea-poster/ideas/new"
                        : "#"
                  }
                  key={item}
                >
                  {item}
                </Link>
              ),
            )}
          </nav>
          <Link
            className="mt-8 block rounded-lg border border-white/20 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            href="/auth/logout"
          >
            Sign out
          </Link>
        </aside>

        <section className="rounded-lg border border-[#d8d2c7] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
                Idea Poster workspace
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-[#101817] md:text-5xl">
                Welcome, {profile.display_name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#5e6e68]">
                Create ideas, publish when ready, and track engagement without
                mixing it up with investor interest or investment records.
              </p>
            </div>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16664a]"
              href="/app/idea-poster/ideas/new"
            >
              <Plus aria-hidden="true" size={17} />
              New idea
            </Link>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <Metric icon={Lightbulb} label="Total ideas" value={ideas.length} />
            <Metric icon={BarChart3} label="Published" value={published} />
            <Metric icon={UsersRound} label="Engagement signals" value={totalEngagement} />
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
                Phase 5 covers the idea object and engagement. Investment
                interests remain a later, separate workflow.
              </p>
            </article>
            <article className="rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-5">
              <h2 className="text-xl font-semibold">My Ideas</h2>
              <p className="mt-3 text-sm leading-6 text-[#60716b]">
                Drafts: {drafts}. Published: {published}. Manage your idea
                pages and public discovery status from one place.
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
        </section>
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-4">
      <Icon aria-hidden="true" className="text-[#3157a4]" size={22} />
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-[#60716b]">{label}</p>
    </article>
  );
}
