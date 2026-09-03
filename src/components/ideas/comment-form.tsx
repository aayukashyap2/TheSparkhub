"use client";

import { useActionState } from "react";
import { addCommentAction } from "@/app/actions/ideas";
import { SubmitButton } from "@/components/auth/submit-button";

type CommentFormProps = {
  ideaId: string;
  slug: string;
};

const initialState = { status: "idle" as const };

export function CommentForm({ ideaId, slug }: CommentFormProps) {
  const [state, formAction] = useActionState(addCommentAction, initialState);

  return (
    <form action={formAction} className="rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm">
      <input name="ideaId" type="hidden" value={ideaId} />
      <input name="slug" type="hidden" value={slug} />
      <label className="text-sm font-semibold text-[#1d302b]" htmlFor="body">
        Join the discussion
      </label>
      <textarea
        className="mt-2 min-h-24 w-full rounded-lg border border-[#cfdad5] bg-white px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
        id="body"
        maxLength={800}
        name="body"
        placeholder="Ask a thoughtful question or offer useful feedback."
        required
      />
      {state.status === "error" ? (
        <p className="mt-3 text-sm text-red-700">{state.message}</p>
      ) : null}
      <div className="mt-4 max-w-44">
        <SubmitButton>Comment</SubmitButton>
      </div>
    </form>
  );
}
