import Link from "next/link";
import { Plus } from "lucide-react";
import { IdeaList } from "@/components/ideas/idea-list";
import { requireRole } from "@/lib/auth/session";
import { listCreatorIdeas } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function MyIdeasPage() {
  const { user, profile } = await requireRole("idea_poster");
  const ideas = await listCreatorIdeas(user.id);

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-6 text-[#101817] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-[#ded7ca] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link className="text-sm font-semibold text-[#1f7a5a]" href="/app/idea-poster">
              Dashboard
            </Link>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">
              Ideas by {profile.display_name}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#60716b]">
              Manage drafts, publish public ideas, and keep engagement signals
              distinct from investor interest and investment records.
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

        <section className="mt-8">
          <IdeaList
            emptyText="Create a draft first. You can publish only when the title, summary, and core idea shape feel ready."
            emptyTitle="No ideas yet"
            ideas={ideas}
            mode="owner"
          />
        </section>
      </div>
    </main>
  );
}
