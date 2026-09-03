import Link from "next/link";
import { AppPageHeader, AppShell, MetricCard } from "@/components/app/app-shell";
import { requireRole } from "@/lib/auth/session";
import { getMentorProfile, listPublicIdeas } from "@/lib/ideas/queries";

export const dynamic = "force-dynamic";

export default async function MentorDashboardPage() {
  const { user, profile } = await requireRole("mentor");
  const [ideas, mentorProfile] = await Promise.all([
    listPublicIdeas(6),
    getMentorProfile(user.id),
  ]);

  return (
    <AppShell active="Dashboard" displayName={profile.display_name} role="mentor">
      <AppPageHeader
        description="Find ideas that need expertise, manage mentorship requests, and keep mentorship distinct from funding activity."
        eyebrow="Mentor workspace"
        title={`Welcome, ${profile.display_name}`}
        action={
          <Link
            className="inline-flex rounded-lg bg-[#1f7a5a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16664a]"
            href="/app/mentor/discover"
          >
            Discover ideas
          </Link>
        }
      />
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <MetricCard label="Ideas available" value={ideas.length} tone="green" />
        <MetricCard
          label="Expertise areas"
          value={mentorProfile?.expertise.length ?? 0}
          tone="blue"
        />
        <MetricCard
          label="Availability"
          value={mentorProfile?.availability ? "Set" : "Open"}
          tone="amber"
        />
      </div>
      <div className="mt-8 rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-5">
        <h2 className="text-xl font-semibold">Mentor journey</h2>
        <div className="mt-5 grid gap-2 sm:grid-cols-4">
          {["Expertise", "Discover", "Requests", "Mentees"].map((step) => (
            <div
              className="rounded-lg border border-[#dfe5e1] bg-white p-3 text-sm font-semibold text-[#263b35]"
              key={step}
            >
              {step}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-[#60716b]">
          Mentorship support can strengthen an idea before investor workflows
          begin.
        </p>
      </div>
    </AppShell>
  );
}
