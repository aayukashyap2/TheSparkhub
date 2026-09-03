"use client";

import { useActionState } from "react";
import { archiveIdeaAction, createIdeaAction, updateIdeaAction } from "@/app/actions/ideas";
import { SubmitButton } from "@/components/auth/submit-button";
import { IDEA_STAGE_LABELS } from "@/lib/ideas/format";
import type {
  CategoryRow,
  IdeaRow,
} from "@/lib/ideas/queries";

type IdeaFormProps = {
  categories: CategoryRow[];
  idea?: IdeaRow;
};

const initialState = { status: "idle" as const };
const stages = ["idea", "prototype", "mvp", "early_traction", "growth"] as const;

export function IdeaForm({ categories, idea }: IdeaFormProps) {
  const action = idea ? updateIdeaAction : createIdeaAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <div className="rounded-lg border border-[#dfe5e1] bg-white p-5 shadow-sm lg:p-6">
      <form action={formAction} className="grid gap-5">
        {idea ? <input name="ideaId" type="hidden" value={idea.id} /> : null}
        <div>
          <label className="text-sm font-semibold text-[#1d302b]" htmlFor="title">
            Title
          </label>
          <input
            className="mt-2 h-11 w-full rounded-lg border border-[#cfdad5] bg-white px-3 text-sm outline-none transition focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
            defaultValue={idea?.title}
            id="title"
            maxLength={96}
            name="title"
            placeholder="AI tutor for rural classrooms"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#1d302b]" htmlFor="summary">
            Summary
          </label>
          <textarea
            className="mt-2 min-h-28 w-full rounded-lg border border-[#cfdad5] bg-white px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
            defaultValue={idea?.summary}
            id="summary"
            maxLength={320}
            name="summary"
            placeholder="Describe the idea, who it helps, and why now."
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldTextarea label="Problem" name="problem" value={idea?.problem} />
          <FieldTextarea label="Solution" name="solution" value={idea?.solution} />
          <FieldTextarea
            label="Target users"
            name="targetUsers"
            value={idea?.target_users}
          />
          <FieldTextarea
            label="Technology"
            name="technology"
            value={idea?.technology}
          />
          <FieldTextarea
            label="Market impact"
            name="marketImpact"
            value={idea?.market_impact}
          />
          <FieldTextarea
            label="Use of funds"
            name="useOfFunds"
            value={idea?.use_of_funds}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-semibold text-[#1d302b]" htmlFor="stage">
              Stage
            </label>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-[#cfdad5] bg-white px-3 text-sm outline-none transition focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
              defaultValue={idea?.stage ?? "idea"}
              id="stage"
              name="stage"
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {IDEA_STAGE_LABELS[stage]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#1d302b]" htmlFor="visibility">
              Visibility
            </label>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-[#cfdad5] bg-white px-3 text-sm outline-none transition focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
              defaultValue={idea?.visibility ?? "private"}
              id="visibility"
              name="visibility"
            >
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#1d302b]" htmlFor="categoryId">
              Category
            </label>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-[#cfdad5] bg-white px-3 text-sm outline-none transition focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
              defaultValue={idea?.category_id ?? ""}
              id="categoryId"
              name="categoryId"
            >
              <option value="">No category yet</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 rounded-lg border border-[#dfe5e1] bg-[#f8faf8] p-4 md:grid-cols-[1fr_180px]">
          <label className="flex items-start gap-3 text-sm text-[#314641]">
            <input
              className="mt-1 size-4 accent-[#1f7a5a]"
              defaultChecked={idea?.seeking_funding}
              name="seekingFunding"
              type="checkbox"
            />
            <span>
              <span className="block font-semibold text-[#1d302b]">
                Seeking funding
              </span>
              Keep this as an idea attribute. Investor interest and actual
              investments stay separate records.
            </span>
          </label>
          <div className="grid grid-cols-[72px_1fr] gap-2">
            <input
              className="h-11 rounded-lg border border-[#cfdad5] bg-white px-3 text-sm uppercase outline-none transition focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
              defaultValue={idea?.funding_currency ?? "INR"}
              maxLength={3}
              name="fundingCurrency"
            />
            <input
              className="h-11 rounded-lg border border-[#cfdad5] bg-white px-3 text-sm outline-none transition focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
              defaultValue={idea?.funding_goal ?? ""}
              min={0}
              name="fundingGoal"
              placeholder="Goal"
              type="number"
            />
          </div>
        </div>

        {state.status === "error" ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.message}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <SubmitButton name="intent" value="draft" variant="secondary">
            Save draft
          </SubmitButton>
          <SubmitButton name="intent" value="publish">
            Publish idea
          </SubmitButton>
        </div>
      </form>

      {idea && idea.status !== "archived" ? (
        <form action={archiveIdeaAction} className="mt-3">
          <input name="ideaId" type="hidden" value={idea.id} />
          <button
            className="h-11 w-full rounded-lg border border-[#e2c9aa] bg-[#fff9ef] px-4 text-sm font-semibold text-[#8a5320] transition hover:border-[#d4912a]"
            type="submit"
          >
            Archive idea
          </button>
        </form>
      ) : null}
    </div>
  );
}

function FieldTextarea({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value?: string | null;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#1d302b]" htmlFor={name}>
        {label}
      </label>
      <textarea
        className="mt-2 min-h-24 w-full rounded-lg border border-[#cfdad5] bg-white px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
        defaultValue={value ?? ""}
        id={name}
        name={name}
      />
    </div>
  );
}
