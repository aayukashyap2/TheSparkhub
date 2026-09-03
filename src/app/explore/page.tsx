import Link from "next/link";
import { Compass, ShieldCheck } from "lucide-react";
import { IdeaList } from "@/components/ideas/idea-list";
import { listPublicIdeas } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore Ideas | SparkHub",
  description:
    "Discover public ideas on SparkHub while keeping watchlists, interests, connections, and investments distinct.",
};

export default async function ExplorePage() {
  const ideas = await listPublicIdeas(12);

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#101817]">
      <header className="border-b border-[#ded7ca] bg-white/76 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link className="text-lg font-semibold" href="/">
            SparkHub
          </Link>
          <div className="flex items-center gap-2">
            <Link
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#314641] transition hover:bg-[#edf3f0]"
              href="/ideas"
            >
              Ideas
            </Link>
            <Link
              className="rounded-lg bg-[#101817] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f7a5a]"
              href="/signup"
            >
              Join
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-[#1f7a5a]">
              <Compass aria-hidden="true" size={16} />
              Explore
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Scan the idea network without blurring the next step.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#60716b]">
              This is the public discovery surface. Watchlists and investment
              interests are investor workflows; actual investment records are
              created later and separately.
            </p>
          </div>
          <div className="rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm">
            <ShieldCheck className="text-[#3157a4]" aria-hidden="true" size={24} />
            <h2 className="mt-4 text-xl font-semibold">Phase 5 boundary</h2>
            <p className="mt-2 text-sm leading-6 text-[#60716b]">
              Explore now reads published ideas and engagement. It does not
              create investor interest or investment records.
            </p>
          </div>
        </div>

        <div className="mt-9">
          <IdeaList
            emptyText="Public discovery will populate when creators publish ideas from their workspace."
            emptyTitle="Explore is ready for real ideas"
            ideas={ideas}
          />
        </div>
      </section>
    </main>
  );
}
