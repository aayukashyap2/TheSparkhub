import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { ROLE_HOME } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/lib/supabase/database.types";

export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  return data;
});

export const getPrimaryRole = cache(async (): Promise<ProfileRole | null> => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profile_roles")
    .select("role, is_primary")
    .eq("profile_id", user.id)
    .order("is_primary", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.role ?? null;
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireOnboardedUser() {
  const user = await requireUser();
  const [profile, primaryRole] = await Promise.all([
    getCurrentProfile(),
    getPrimaryRole(),
  ]);

  if (!profile?.onboarding_completed || !primaryRole) {
    redirect("/onboarding");
  }

  return { user, profile, primaryRole };
}

export async function requireRole(role: ProfileRole) {
  const context = await requireOnboardedUser();

  if (context.primaryRole !== role) {
    redirect(ROLE_HOME[context.primaryRole]);
  }

  return context;
}
