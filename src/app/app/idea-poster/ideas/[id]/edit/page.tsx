import Link from "next/link";
import { notFound } from "next/navigation";
import { IdeaForm } from "@/components/ideas/idea-form";
import { IDEA_STATUS_LABELS, formatDate } from "@/lib/ideas/format";
import { getCreatorIdea, listCategories } from "@/lib/ideas/queries";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function EditIdeaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  const { id } = await params;
  const { updated } = await searchParams;
  const { user } = await requireRole("idea_poster");
  const [idea, categories] = await Promise.all([
    getCreatorIdea(id, user.id),
    listCategories(),
  ]);

  if (!idea) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-6 text-[#101817] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link className="text-sm font-semibold text-[#1f7a5a]" href="/app/idea-poster/ideas">
          Back to my ideas
        </Link>
        <div className="mt-6 rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
                {IDEA_STATUS_LABELS[idea.status]}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-normal">
                {idea.title}
              </h1>
              <p className="mt-3 text-sm text-[#60716b]">
                Published: {formatDate(idea.published_at)}
              </p>
            </div>
            {idea.status === "published" ? (
              <Link
                className="inline-flex rounded-lg border border-[#cfdad5] px-4 py-2 text-sm font-semibold text-[#263b35] transition hover:border-[#1f7a5a]"
                href={`/ideas/${idea.slug}`}
              >
                View public page
              </Link>
            ) : null}
          </div>
          {updated === "1" ? (
            <p className="mt-4 rounded-lg border border-[#bad9cc] bg-[#edf7f2] px-3 py-2 text-sm text-[#176247]">
              Idea updated.
            </p>
          ) : null}
        </div>
        <div className="mt-6">
          <IdeaForm categories={categories} idea={idea} />
        </div>
      </div>
    </main>
  );
}
