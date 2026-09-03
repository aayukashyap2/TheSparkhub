import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { IdeaCard } from "@/components/ideas/idea-card";
import type { PublicIdea } from "@/lib/ideas/queries";

type IdeaListProps = {
  ideas: PublicIdea[];
  emptyTitle: string;
  emptyText: string;
  mode?: "public" | "owner";
};

export function IdeaList({
  ideas,
  emptyTitle,
  emptyText,
  mode = "public",
}: IdeaListProps) {
  if (ideas.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#bdccc6] bg-white/70 p-8 text-center">
        <Lightbulb className="mx-auto text-[#1f7a5a]" aria-hidden="true" size={30} />
        <h2 className="mt-4 text-2xl font-semibold text-[#101817]">
          {emptyTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#60716b]">
          {emptyText}
        </p>
        {mode === "owner" ? (
          <Link
            className="mt-6 inline-flex rounded-lg bg-[#1f7a5a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#16664a]"
            href="/app/idea-poster/ideas/new"
          >
            Create first idea
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {ideas.map((idea) => (
        <IdeaCard idea={idea} key={idea.id} mode={mode} />
      ))}
    </div>
  );
}
