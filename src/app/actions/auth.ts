"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/env";
import { ROLE_HOME, SELF_SELECTABLE_ROLES } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SelfSelectableRole } from "@/lib/auth/roles";

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fields?: Record<string, string>;
};

const EmailPasswordSchema = z.object({
  email: z.string().email("Use a valid email address.").trim(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  next: z.string().optional(),
});

const SignUpSchema = EmailPasswordSchema.extend({
  displayName: z.string().min(2, "Add your display name.").trim(),
});

const OnboardingSchema = z.object({
  displayName: z.string().min(2, "Add your display name.").trim(),
  role: z.enum(SELF_SELECTABLE_ROLES),
  headline: z.string().max(120).optional(),
  sectors: z.string().max(240).optional(),
  goals: z.string().max(240).optional(),
});

function errorState(message: string): FormState {
  return { status: "error", message };
}

function normalizeList(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

async function getOrigin() {
  const headersList = await headers();
  return headersList.get("origin") ?? getSiteUrl();
}

function getRedirectPath(formData: FormData) {
  const next = String(formData.get("next") ?? "");
  return next.startsWith("/") ? next : "/app";
}

export async function signInWithPasswordAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return errorState("Supabase keys are not configured in .env.local yet.");
  }

  const parsed = EmailPasswordSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Check the form.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return errorState(error.message);
  }

  redirect(parsed.data.next?.startsWith("/") ? parsed.data.next : "/app");
}

export async function signUpWithPasswordAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return errorState("Supabase keys are not configured in .env.local yet.");
  }

  const parsed = SignUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Check the form.");
  }

  const origin = await getOrigin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.displayName,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
    },
  });

  if (error) {
    return errorState(error.message);
  }

  if (data.session) {
    redirect("/onboarding");
  }

  return {
    status: "success",
    message: "Check your email to confirm your SparkHub account.",
  };
}

export async function signInWithGoogleAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?message=missing-config");
  }

  const origin = await getOrigin();
  const next = getRedirectPath(formData);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    redirect("/login?message=oauth-error");
  }

  redirect(data.url);
}

export async function completeOnboardingAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return errorState("Supabase keys are not configured in .env.local yet.");
  }

  const parsed = OnboardingSchema.safeParse({
    displayName: formData.get("displayName"),
    role: formData.get("role"),
    headline: formData.get("headline"),
    sectors: formData.get("sectors"),
    goals: formData.get("goals"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Check the form.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return errorState("Your session expired. Please sign in again.");
  }

  const role = parsed.data.role as SelfSelectableRole;
  const sectors = normalizeList(parsed.data.sectors);
  const goals = normalizeList(parsed.data.goals);

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: parsed.data.displayName,
    headline: parsed.data.headline || null,
    onboarding_completed: true,
  });

  if (profileError) {
    return errorState(profileError.message);
  }

  await supabase
    .from("profile_roles")
    .delete()
    .eq("profile_id", user.id)
    .neq("role", "admin");

  const { error: roleError } = await supabase.from("profile_roles").insert({
    profile_id: user.id,
    role,
    is_primary: true,
  });

  if (roleError) {
    return errorState(roleError.message);
  }

  await supabase.from("user_preferences").upsert({
    profile_id: user.id,
    sectors,
    goals,
  });

  if (role === "investor") {
    await supabase.from("investor_profiles").upsert({
      profile_id: user.id,
      sectors,
    });
  }

  if (role === "mentor") {
    await supabase.from("mentor_profiles").upsert({
      profile_id: user.id,
      expertise: sectors,
    });
  }

  redirect(ROLE_HOME[role]);
}
