import Link from "next/link";
import {
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  ROLE_NAV_ITEMS,
} from "@/lib/auth/roles";
import type { ProfileRole } from "@/lib/supabase/database.types";

type RoleDashboardProps = {
  role: ProfileRole;
  displayName: string;
};

export function RoleDashboard({ role, displayName }: RoleDashboardProps) {
  const workflows = ROLE_NAV_ITEMS[role];

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#13211f]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-5 py-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-[#d8d2c7] bg-[#10231f] p-4 text-white shadow-sm">
          <Link className="block text-lg font-semibold" href="/">
            SparkHub
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9fc2b6]">
            {ROLE_LABELS[role]}
          </p>
          <nav className="mt-8 space-y-1">
            {workflows.map((item, index) => (
              <Link
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  index === 0
                    ? "bg-white text-[#10231f]"
                    : "text-[#d9e7e1] hover:bg-white/10"
                }`}
                href={item.href}
                key={`${item.label}-${item.href}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            className="mt-8 block rounded-lg border border-white/20 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            href="/auth/logout"
          >
            Sign out
          </Link>
        </aside>

        <section className="rounded-lg border border-[#d8d2c7] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f7d68]">
            {ROLE_LABELS[role]} workspace
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-[#101817] md:text-5xl">
            Welcome, {displayName}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5e6e68]">
            {ROLE_DESCRIPTIONS[role]}
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {workflows.slice(1).map((item) => (
              <article
                className="rounded-lg border border-[#e0e5e2] bg-[#fbfcfb] p-4 transition hover:-translate-y-0.5 hover:border-[#9bc5b5] hover:shadow-sm"
                key={`${item.label}-${item.href}`}
              >
                <h2 className="text-base font-semibold text-[#13211f]">
                  {item.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#64736e]">
                  Open this workspace to manage the records, signals, and
                  conversations connected to your role.
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
