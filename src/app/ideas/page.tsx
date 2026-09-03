import Link from "next/link";
import { Plus } from "lucide-react";
import { IdeaList } from "@/components/ideas/idea-list";
import { listPublicIdeas } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ideas | SparkHub",
  description:
    "Browse public SparkHub ideas backed by the real idea lifecycle and engagement model.",
};

export default async function IdeasPage() {
  const ideas = await listPublicIdeas();

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#101817]">
      <header className="border-b border-[#ded7ca] bg-white/76 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link className="text-lg font-semibold" href="/">
            SparkHub
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#16664a]"
            href="/app/idea-poster/ideas/new"
          >
            <Plus aria-hidden="true" size={16} />
            Post idea
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
          Public ideas
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
              Discover ideas with real engagement signals.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#60716b]">
              Public ideas appear here after creators publish them. Likes,
              saves, follows, shares, and comments stay separate from investor
              interest.
            </p>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-lg border border-[#cfdad5] bg-white px-4 py-3 text-sm font-semibold text-[#263b35] transition hover:border-[#1f7a5a]"
            href="/explore"
          >
            Open Explore
          </Link>
        </div>

        <div className="mt-9">
          <IdeaList
            emptyText="Once idea posters publish public ideas, this page will show real records from Supabase with engagement counts from the platform tables."
            emptyTitle="No public ideas yet"
            ideas={ideas}
          />
        </div>
      </section>
    </main>
  );
}
