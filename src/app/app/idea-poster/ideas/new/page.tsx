import Link from "next/link";
import { IdeaForm } from "@/components/ideas/idea-form";
import { requireRole } from "@/lib/auth/session";
import { listCategories } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function NewIdeaPage() {
  await requireRole("idea_poster");
  const categories = await listCategories();

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-6 text-[#101817] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link className="text-sm font-semibold text-[#1f7a5a]" href="/app/idea-poster/ideas">
          Back to my ideas
        </Link>
        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
            Create
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Shape the idea before it meets the market.
          </h1>
          <p className="mt-4 text-base leading-7 text-[#60716b]">
            Save privately while you are drafting, then publish when the idea is
            ready for public discovery and engagement.
          </p>
        </div>
        <div className="mt-8">
          <IdeaForm categories={categories} />
        </div>
      </div>
    </main>
  );
}
