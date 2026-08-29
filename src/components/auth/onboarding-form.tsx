"use client";

import { useActionState } from "react";
import { completeOnboardingAction, type FormState } from "@/app/actions/auth";
import {
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  SELF_SELECTABLE_ROLES,
} from "@/lib/auth/roles";
import { SubmitButton } from "@/components/auth/submit-button";
import type { SelfSelectableRole } from "@/lib/auth/roles";

const initialState: FormState = { status: "idle" };

type OnboardingFormProps = {
  defaultDisplayName: string;
};

export function OnboardingForm({ defaultDisplayName }: OnboardingFormProps) {
  const [state, action] = useActionState(
    completeOnboardingAction,
    initialState,
  );

  return (
    <form
      action={action}
      className="rounded-lg border border-[#d8e0dc] bg-white p-6 shadow-sm"
    >
      <label className="block text-sm font-medium text-[#263732]">
        Display name
        <input
          className="mt-2 h-11 w-full rounded-lg border border-[#ccd6d1] bg-[#fbfcfb] px-3 text-sm text-[#13211f] outline-none transition focus:border-[#2f7d68] focus:ring-4 focus:ring-[#2f7d68]/10"
          defaultValue={defaultDisplayName}
          name="displayName"
          required
          type="text"
        />
      </label>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-[#263732]">
          Choose your primary SparkHub role
        </legend>
        <div className="mt-3 grid gap-3">
          {SELF_SELECTABLE_ROLES.map((role) => (
            <RoleOption key={role} role={role} />
          ))}
        </div>
      </fieldset>

      <label className="mt-6 block text-sm font-medium text-[#263732]">
        Headline
        <input
          className="mt-2 h-11 w-full rounded-lg border border-[#ccd6d1] bg-[#fbfcfb] px-3 text-sm text-[#13211f] outline-none transition focus:border-[#2f7d68] focus:ring-4 focus:ring-[#2f7d68]/10"
          name="headline"
          placeholder="Founder, angel investor, product mentor..."
          type="text"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-[#263732]">
        Sectors
        <input
          className="mt-2 h-11 w-full rounded-lg border border-[#ccd6d1] bg-[#fbfcfb] px-3 text-sm text-[#13211f] outline-none transition focus:border-[#2f7d68] focus:ring-4 focus:ring-[#2f7d68]/10"
          name="sectors"
          placeholder="AI, climate, health, fintech"
          type="text"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-[#263732]">
        Goals
        <input
          className="mt-2 h-11 w-full rounded-lg border border-[#ccd6d1] bg-[#fbfcfb] px-3 text-sm text-[#13211f] outline-none transition focus:border-[#2f7d68] focus:ring-4 focus:ring-[#2f7d68]/10"
          name="goals"
          placeholder="Raise funding, discover ideas, mentor builders"
          type="text"
        />
      </label>

      {state.message ? (
        <p className="mt-4 rounded-lg bg-[#fff0ec] px-3 py-2 text-sm text-[#9c321f]">
          {state.message}
        </p>
      ) : null}

      <div className="mt-6">
        <SubmitButton>Enter SparkHub</SubmitButton>
      </div>
    </form>
  );
}

function RoleOption({ role }: { role: SelfSelectableRole }) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-lg border border-[#d8e0dc] bg-[#fbfcfb] p-4 transition hover:border-[#7fb29d] has-[:checked]:border-[#2f7d68] has-[:checked]:bg-[#eff8f3]">
      <input
        className="mt-1 size-4 accent-[#2f7d68]"
        name="role"
        required
        type="radio"
        value={role}
      />
      <span>
        <span className="block text-sm font-semibold text-[#15241f]">
          {ROLE_LABELS[role]}
        </span>
        <span className="mt-1 block text-sm leading-6 text-[#60716b]">
          {ROLE_DESCRIPTIONS[role]}
        </span>
      </span>
    </label>
  );
}
