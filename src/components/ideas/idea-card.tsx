import Link from "next/link";
import {
  Archive,
  Eye,
  Heart,
  MessageCircle,
  Pencil,
  Signal,
  UsersRound,
} from "lucide-react";
import { IDEA_STAGE_LABELS, IDEA_STATUS_LABELS, formatDate } from "@/lib/ideas/format";
import type { PublicIdea } from "@/lib/ideas/queries";

type IdeaCardProps = {
  idea: PublicIdea;
  href?: string;
  mode?: "public" | "owner";
};

export function IdeaCard({ idea, href, mode = "public" }: IdeaCardProps) {
  const target = href ?? `/ideas/${idea.slug}`;

  return (
    <article className="rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#8eb9aa] hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-[#60716b]">
        <span className="rounded-full bg-[#eef5f1] px-2.5 py-1 text-[#1f7a5a]">
          {IDEA_STAGE_LABELS[idea.stage]}
        </span>
        {mode === "owner" ? (
          <span className="rounded-full bg-[#f5efe2] px-2.5 py-1 text-[#806020]">
            {IDEA_STATUS_LABELS[idea.status]}
          </span>
        ) : null}
        {idea.categoryName ? <span>{idea.categoryName}</span> : null}
      </div>

      <Link href={target}>
        <h2 className="mt-4 text-xl font-semibold leading-snug tracking-normal text-[#101817]">
          {idea.title}
        </h2>
      </Link>
      <p className="mt-3 text-sm leading-6 text-[#60716b]">{idea.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#60716b]">
        <span className="inline-flex items-center gap-1.5">
          <Signal aria-hidden="true" size={14} />
          {idea.seeking_funding ? "Funding-aware" : "Collaboration-first"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Eye aria-hidden="true" size={14} />
          {formatDate(idea.published_at)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-lg bg-[#f6f8f6] p-2 text-center text-xs text-[#60716b]">
        <span className="inline-flex items-center justify-center gap-1">
          <Heart aria-hidden="true" size={14} />
          {idea.engagement.likes}
        </span>
        <span className="inline-flex items-center justify-center gap-1">
          <UsersRound aria-hidden="true" size={14} />
          {idea.engagement.followers}
        </span>
        <span className="inline-flex items-center justify-center gap-1">
          <MessageCircle aria-hidden="true" size={14} />
          {idea.engagement.comments}
        </span>
      </div>

      <div className="mt-5 flex gap-2">
        <Link
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#101817] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f7a5a]"
          href={target}
        >
          {mode === "owner" ? "Manage" : "View"}
        </Link>
        {mode === "owner" ? (
          <Link
            className="inline-flex size-10 items-center justify-center rounded-lg border border-[#cfdad5] bg-white text-[#314641] transition hover:border-[#1f7a5a]"
            href={`/app/idea-poster/ideas/${idea.id}/edit`}
            title="Edit idea"
          >
            <Pencil aria-hidden="true" size={17} />
          </Link>
        ) : null}
        {idea.status === "archived" ? (
          <span
            className="inline-flex size-10 items-center justify-center rounded-lg border border-[#e2d6c1] bg-[#fbf6ec] text-[#8a6320]"
            title="Archived"
          >
            <Archive aria-hidden="true" size={17} />
          </span>
        ) : null}
      </div>
    </article>
  );
}
