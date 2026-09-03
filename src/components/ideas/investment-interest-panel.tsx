import { BriefcaseBusiness, MessageCircle } from "lucide-react";
import { createInvestmentInterestAction } from "@/app/actions/ideas";
import { SubmitButton } from "@/components/auth/submit-button";
import { IDEA_STAGE_LABELS } from "@/lib/ideas/format";
import type { IdeaStage } from "@/lib/supabase/database.types";

type InvestmentInterestPanelProps = {
  ideaId: string;
  slug: string;
  stage: IdeaStage;
};

export function InvestmentInterestPanel({
  ideaId,
  slug,
  stage,
}: InvestmentInterestPanelProps) {
  return (
    <form
      action={createInvestmentInterestAction}
      className="rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm"
    >
      <input name="ideaId" type="hidden" value={ideaId} />
      <input name="slug" type="hidden" value={slug} />
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eef5f1] text-[#1f7a5a]">
          <BriefcaseBusiness aria-hidden="true" size={19} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
            Investor interest
          </p>
          <h2 className="mt-2 text-lg font-semibold">Start the right signal.</h2>
          <p className="mt-2 text-sm leading-6 text-[#60716b]">
            This creates an investment interest record for a{" "}
            {IDEA_STAGE_LABELS[stage].toLowerCase()} idea. It does not create an
            investment.
          </p>
        </div>
      </div>

      <label className="mt-5 block text-sm font-semibold text-[#263b35]">
        Interest level
        <select
          className="mt-2 w-full rounded-lg border border-[#ccd6d1] bg-white px-3 py-2 text-sm text-[#172521] outline-none transition focus:border-[#1f7a5a]"
          defaultValue="medium"
          name="level"
        >
          <option value="low">Light interest</option>
          <option value="medium">Interested</option>
          <option value="high">Strong interest</option>
        </select>
      </label>

      <label className="mt-4 block text-sm font-semibold text-[#263b35]">
        Possible range
        <input
          className="mt-2 w-full rounded-lg border border-[#ccd6d1] bg-white px-3 py-2 text-sm text-[#172521] outline-none transition focus:border-[#1f7a5a]"
          name="proposedRange"
          placeholder="Demo: INR 5L - 15L"
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-[#263b35]">
        Note for the creator
        <textarea
          className="mt-2 min-h-24 w-full resize-y rounded-lg border border-[#ccd6d1] bg-white px-3 py-2 text-sm text-[#172521] outline-none transition focus:border-[#1f7a5a]"
          name="message"
          placeholder="What caught your attention?"
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-[#263b35]">
        Questions
        <textarea
          className="mt-2 min-h-20 w-full resize-y rounded-lg border border-[#ccd6d1] bg-white px-3 py-2 text-sm text-[#172521] outline-none transition focus:border-[#1f7a5a]"
          name="questions"
          placeholder="What would you like to discuss before connecting?"
        />
      </label>

      <div className="mt-5">
        <SubmitButton>
          <span className="inline-flex items-center gap-2">
            Create interest
            <MessageCircle aria-hidden="true" size={16} />
          </span>
        </SubmitButton>
      </div>
    </form>
  );
}
