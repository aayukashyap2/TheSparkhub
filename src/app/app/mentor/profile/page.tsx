import { AppPageHeader, AppShell, MetricCard } from "@/components/app/app-shell";
import { requireRole } from "@/lib/auth/session";
import { getMentorProfile } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function MentorProfilePage() {
  const { user, profile } = await requireRole("mentor");
  const mentorProfile = await getMentorProfile(user.id);

  return (
    <AppShell active="Profile" displayName={profile.display_name} role="mentor">
      <AppPageHeader
        description="Your expertise profile will drive matching and request quality in later phases."
        eyebrow="Mentor profile"
        title="Your mentor context"
      />
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Expertise areas"
          value={mentorProfile?.expertise.length ?? 0}
          tone="green"
        />
        <MetricCard
          label="Visibility"
          value={mentorProfile?.visibility ?? "public"}
          tone="blue"
        />
        <MetricCard
          label="Availability"
          value={mentorProfile?.availability ? "Set" : "Open"}
          tone="amber"
        />
      </div>
      <div className="mt-8 rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-5">
        <h2 className="text-xl font-semibold">Profile summary</h2>
        <p className="mt-3 text-sm leading-6 text-[#60716b]">
          {mentorProfile?.bio ??
            "Mentor onboarding has created the profile record. Rich profile editing comes in a later pass."}
        </p>
      </div>
    </AppShell>
  );
}
