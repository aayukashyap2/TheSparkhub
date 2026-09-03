import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bookmark,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Signal,
  UsersRound,
} from "lucide-react";
import { CommentForm } from "@/components/ideas/comment-form";
import { EngagementActions } from "@/components/ideas/engagement-actions";
import { InvestmentInterestPanel } from "@/components/ideas/investment-interest-panel";
import { IDEA_STAGE_LABELS, formatDate } from "@/lib/ideas/format";
import { getPublicIdea, listIdeaComments } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idea = await getPublicIdea(slug);

  return {
    title: idea ? `${idea.title} | SparkHub` : "Idea | SparkHub",
    description: idea?.summary ?? "SparkHub idea detail page.",
  };
}

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idea = await getPublicIdea(slug);

  if (!idea) {
    notFound();
  }

  const comments = await listIdeaComments(idea.id);
  const stats = [
    { label: "Likes", value: idea.engagement.likes, icon: Heart },
    { label: "Saves", value: idea.engagement.saves, icon: Bookmark },
    { label: "Followers", value: idea.engagement.followers, icon: UsersRound },
    { label: "Comments", value: idea.engagement.comments, icon: MessageCircle },
    { label: "Shares", value: idea.engagement.shares, icon: Share2 },
  ];

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#101817]">
      <header className="border-b border-[#ded7ca] bg-white/76 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link className="text-lg font-semibold" href="/">
            SparkHub
          </Link>
          <Link
            className="rounded-lg border border-[#cfdad5] px-4 py-2 text-sm font-semibold text-[#263b35] transition hover:border-[#1f7a5a]"
            href="/ideas"
          >
            All ideas
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_340px]">
        <article className="rounded-lg border border-[#dfe5e1] bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-[#60716b]">
            <span className="rounded-full bg-[#eef5f1] px-2.5 py-1 text-[#1f7a5a]">
              {IDEA_STAGE_LABELS[idea.stage]}
            </span>
            {idea.categoryName ? <span>{idea.categoryName}</span> : null}
            <span className="inline-flex items-center gap-1">
              <Calendar aria-hidden="true" size={14} />
              {formatDate(idea.published_at)}
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            {idea.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#4c5f58]">{idea.summary}</p>

          <div className="mt-8 grid gap-5">
            <Section title="Problem" text={idea.problem} />
            <Section title="Solution" text={idea.solution} />
            <Section title="Target users" text={idea.target_users} />
            <Section title="Technology" text={idea.technology} />
            <Section title="Market impact" text={idea.market_impact} />
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
              Creator
            </p>
            <h2 className="mt-2 text-xl font-semibold">{idea.creatorName}</h2>
            <p className="mt-3 text-sm leading-6 text-[#60716b]">
              Engagement actions are early product signals. Investor interest
              and investment records remain separate workflows.
            </p>
          </div>

          <div className="rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
              Engagement
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {stats.map((stat) => (
                <div className="rounded-lg bg-[#f6f8f6] p-3" key={stat.label}>
                  <stat.icon
                    aria-hidden="true"
                    className="text-[#3157a4]"
                    size={17}
                  />
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-[#60716b]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm">
            <Signal aria-hidden="true" className="text-[#d4912a]" size={22} />
            <h2 className="mt-3 text-lg font-semibold">
              {idea.seeking_funding
                ? "Funding-aware idea"
                : "Collaboration-first idea"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#60716b]">
              {idea.seeking_funding &&
              idea.funding_visibility === "public" &&
              idea.funding_goal
                ? `${idea.funding_currency} ${idea.funding_goal.toLocaleString()} goal.`
                : "Funding details stay private unless the creator chooses otherwise."}
            </p>
          </div>

          <InvestmentInterestPanel
            ideaId={idea.id}
            slug={idea.slug}
            stage={idea.stage}
          />
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
        <EngagementActions ideaId={idea.id} slug={idea.slug} />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <CommentForm ideaId={idea.id} slug={idea.slug} />
          <div className="rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Recent comments</h2>
            <div className="mt-4 space-y-3">
              {comments.length === 0 ? (
                <p className="text-sm leading-6 text-[#60716b]">
                  No comments yet. The first discussion will appear here.
                </p>
              ) : (
                comments.map((comment) => (
                  <article className="rounded-lg bg-[#f6f8f6] p-4" key={comment.id}>
                    <p className="text-sm font-semibold text-[#263b35]">
                      {comment.authorName}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#60716b]">
                      {comment.body}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Section({ title, text }: { title: string; text: string | null }) {
  if (!text) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 whitespace-pre-line text-base leading-7 text-[#60716b]">
        {text}
      </p>
    </section>
  );
}
