import { Bookmark, Heart, Share2, UsersRound } from "lucide-react";
import { recordShareAction, toggleIdeaSignalAction } from "@/app/actions/ideas";

type EngagementActionsProps = {
  ideaId: string;
  slug: string;
};

export function EngagementActions({ ideaId, slug }: EngagementActionsProps) {
  const actions = [
    { label: "Like", signal: "like", icon: Heart },
    { label: "Save", signal: "save", icon: Bookmark },
    { label: "Follow", signal: "follow", icon: UsersRound },
  ] as const;

  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {actions.map((action) => (
        <form action={toggleIdeaSignalAction} key={action.signal}>
          <input name="ideaId" type="hidden" value={ideaId} />
          <input name="slug" type="hidden" value={slug} />
          <input name="signal" type="hidden" value={action.signal} />
          <button
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#cfdad5] bg-white px-3 text-sm font-semibold text-[#263b35] transition hover:border-[#1f7a5a] hover:text-[#1f7a5a]"
            type="submit"
          >
            <action.icon aria-hidden="true" size={16} />
            {action.label}
          </button>
        </form>
      ))}
      <form action={recordShareAction}>
        <input name="ideaId" type="hidden" value={ideaId} />
        <input name="slug" type="hidden" value={slug} />
        <button
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#cfdad5] bg-white px-3 text-sm font-semibold text-[#263b35] transition hover:border-[#3157a4] hover:text-[#3157a4]"
          type="submit"
        >
          <Share2 aria-hidden="true" size={16} />
          Share
        </button>
      </form>
    </div>
  );
}
