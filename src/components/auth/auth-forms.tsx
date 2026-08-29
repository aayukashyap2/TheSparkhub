"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signInWithGoogleAction,
  signInWithPasswordAction,
  signUpWithPasswordAction,
  type FormState,
} from "@/app/actions/auth";
import { SubmitButton } from "@/components/auth/submit-button";

const initialState: FormState = { status: "idle" };

type AuthFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/app" }: AuthFormProps) {
  const [state, action] = useActionState(
    signInWithPasswordAction,
    initialState,
  );

  return (
    <div className="rounded-lg border border-[#d8e0dc] bg-white p-6 shadow-sm">
      <form action={signInWithGoogleAction}>
        <input name="next" type="hidden" value={nextPath} />
        <SubmitButton variant="secondary">Continue with Google</SubmitButton>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#7d8b86]">
        <span className="h-px flex-1 bg-[#e2e8e5]" />
        or
        <span className="h-px flex-1 bg-[#e2e8e5]" />
      </div>

      <form action={action} className="space-y-4">
        <input name="next" type="hidden" value={nextPath} />
        <Field label="Email" name="email" type="email" />
        <Field label="Password" name="password" type="password" />
        <SubmitButton>Sign in</SubmitButton>
      </form>

      <FormMessage state={state} />

      <p className="mt-5 text-center text-sm text-[#61706b]">
        New to SparkHub?{" "}
        <Link className="font-semibold text-[#1f6b59]" href="/signup">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export function SignUpForm() {
  const [state, action] = useActionState(
    signUpWithPasswordAction,
    initialState,
  );

  return (
    <div className="rounded-lg border border-[#d8e0dc] bg-white p-6 shadow-sm">
      <form action={signInWithGoogleAction}>
        <input name="next" type="hidden" value="/onboarding" />
        <SubmitButton variant="secondary">Continue with Google</SubmitButton>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#7d8b86]">
        <span className="h-px flex-1 bg-[#e2e8e5]" />
        or
        <span className="h-px flex-1 bg-[#e2e8e5]" />
      </div>

      <form action={action} className="space-y-4">
        <Field label="Display name" name="displayName" type="text" />
        <Field label="Email" name="email" type="email" />
        <Field label="Password" name="password" type="password" />
        <SubmitButton>Create account</SubmitButton>
      </form>

      <FormMessage state={state} />

      <p className="mt-5 text-center text-sm text-[#61706b]">
        Already have an account?{" "}
        <Link className="font-semibold text-[#1f6b59]" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <label className="block text-sm font-medium text-[#263732]">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-lg border border-[#ccd6d1] bg-[#fbfcfb] px-3 text-sm text-[#13211f] outline-none transition placeholder:text-[#93a19c] focus:border-[#2f7d68] focus:ring-4 focus:ring-[#2f7d68]/10"
        name={name}
        required
        type={type}
      />
    </label>
  );
}

function FormMessage({ state }: { state: FormState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={`mt-4 rounded-lg px-3 py-2 text-sm ${
        state.status === "success"
          ? "bg-[#e7f5ee] text-[#176248]"
          : "bg-[#fff0ec] text-[#9c321f]"
      }`}
    >
      {state.message}
    </p>
  );
}
