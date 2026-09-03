import Link from "next/link";
import { ROLE_LABELS, ROLE_NAV_ITEMS } from "@/lib/auth/roles";
import type { ProfileRole } from "@/lib/supabase/database.types";

type AppShellProps = {
  active: string;
  children: React.ReactNode;
  displayName: string;
  role: ProfileRole;
};

export function AppShell({
  active,
  children,
  displayName,
  role,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#101817]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-5 py-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-[#d8d2c7] bg-[#10231f] p-4 text-white shadow-sm">
          <Link className="block text-lg font-semibold" href="/">
            SparkHub
          </Link>
          <p className="mt-1 text-xs uppercase text-[#9fc2b6]">
            {ROLE_LABELS[role]}
          </p>
          <p className="mt-5 rounded-lg bg-white/8 px-3 py-2 text-sm text-[#d9e7e1]">
            {displayName}
          </p>
          <nav className="mt-6 space-y-1">
            {ROLE_NAV_ITEMS[role].map((item) => (
              <Link
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  item.label === active
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
        <section className="min-w-0 rounded-lg border border-[#d8d2c7] bg-white p-6 shadow-sm">
          {children}
        </section>
      </div>
    </main>
  );
}

type AppPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function AppPageHeader({
  eyebrow,
  title,
  description,
  action,
}: AppPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-[#101817] md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#5e6e68]">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  tone = "blue",
}: {
  label: string;
  value: number | string;
  tone?: "blue" | "green" | "amber";
}) {
  const toneClass = {
    amber: "text-[#8a5e16]",
    blue: "text-[#3157a4]",
    green: "text-[#1f7a5a]",
  }[tone];

  return (
    <article className="rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-4">
      <p className={`text-3xl font-semibold ${toneClass}`}>{value}</p>
      <p className="mt-1 text-sm text-[#60716b]">{label}</p>
    </article>
  );
}
