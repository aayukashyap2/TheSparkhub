import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { getCurrentProfile, requireUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login?message=missing-config");
  }

  const user = await requireUser();
  const profile = await getCurrentProfile();

  if (profile?.onboarding_completed) {
    redirect("/app");
  }

  const defaultDisplayName =
    profile?.display_name ??
    String(user.user_metadata.display_name ?? "") ??
    user.email?.split("@")[0] ??
    "";

  return (
    <main className="min-h-screen bg-[#f6f4ef] px-5 py-10 text-[#13211f]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_500px]">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f7d68]">
            Onboarding
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight tracking-normal text-[#101817] md:text-6xl">
            Choose the workspace that matches your real intent.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#5f6f69]">
            SparkHub stores roles in the database so product logic can separate
            idea posting, investor interest, mentorship, and admin operations.
          </p>
        </section>
        <OnboardingForm defaultDisplayName={defaultDisplayName} />
      </div>
    </main>
  );
}
