import Link from "next/link";
import { Compass, MessageCircle } from "lucide-react";
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link className="text-base font-semibold" href="/">
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

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-[#1f7a5a]">
              <Compass aria-hidden="true" size={16} />
              Explore
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">
              Browse ideas that are ready for better conversations.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#60716b]">
              Discover public ideas, read the context, and choose the next step
              only when there is a real reason to move forward.
            </p>
          </div>
          <div className="rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm">
            <MessageCircle className="text-[#3157a4]" aria-hidden="true" size={24} />
            <h2 className="mt-4 text-xl font-semibold">Discovery with context</h2>
            <p className="mt-2 text-sm leading-6 text-[#60716b]">
              Save ideas, follow progress, or create investor interest from the
              idea page when the signal is serious.
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
