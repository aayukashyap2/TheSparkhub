import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Compass,
  Handshake,
  Lightbulb,
  MessageSquareText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type PublicSectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  tiles: Array<{
    title: string;
    text: string;
    icon: LucideIcon;
  }>;
};

const navItems = [
  { label: "Explore", href: "/explore" },
  { label: "Ideas", href: "/ideas" },
  { label: "Investors", href: "/investors" },
  { label: "Mentors", href: "/mentors" },
];

export const pageTiles = {
  explore: [
    {
      title: "Discover public ideas",
      text: "Browse ideas by domain, traction signals, and collaboration needs.",
      icon: Compass,
    },
    {
      title: "Save before acting",
      text: "Watchlist behavior stays separate from investment interest.",
      icon: ShieldCheck,
    },
    {
      title: "Move with context",
      text: "Investor interest starts a tracked workflow, not a financial record.",
      icon: Handshake,
    },
  ],
  ideas: [
    {
      title: "Create and refine",
      text: "Idea posters get a dedicated path for drafting, publishing, and measuring engagement.",
      icon: Lightbulb,
    },
    {
      title: "Understand signals",
      text: "Interest, follows, comments, and connection requests become separate evidence.",
      icon: MessageSquareText,
    },
    {
      title: "Collaborate safely",
      text: "Mentors and investors can connect without forcing premature investment records.",
      icon: UsersRound,
    },
  ],
  investors: [
    {
      title: "Discover by thesis",
      text: "Investors can explore ideas through filters built for serious evaluation.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Track interests",
      text: "Every interested action belongs to the investment interest workflow.",
      icon: ShieldCheck,
    },
    {
      title: "Build a portfolio later",
      text: "Portfolio records are created only after real discussion and confirmed investment data.",
      icon: ArrowRight,
    },
  ],
  mentors: [
    {
      title: "Find relevant founders",
      text: "Mentors can discover ideas and founders by domain, stage, and support needs.",
      icon: UsersRound,
    },
    {
      title: "Guide momentum",
      text: "Mentorship can improve idea quality before investor conversations begin.",
      icon: MessageSquareText,
    },
    {
      title: "Stay distinct from funding",
      text: "Mentor relationships are collaborations, not investment interest by default.",
      icon: ShieldCheck,
    },
  ],
};

export function PublicSectionPage({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  tiles,
}: PublicSectionPageProps) {
  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#101817]">
      <header className="border-b border-[#ded7ca] bg-white/76 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link className="text-base font-semibold" href="/">
            SparkHub
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#314641] transition hover:bg-[#edf3f0]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            className="rounded-lg bg-[#101817] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f7a5a]"
            href="/signup"
          >
            Join
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
        <div>
          <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#60716b]">
            {description}
          </p>
          <Link
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1f7a5a] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#16664a]"
            href={primaryHref}
          >
            {primaryLabel}
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>

        <div className="grid gap-4">
          {tiles.map((tile) => (
            <article
              className="rounded-lg border border-[#dce3df] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#8eb9aa] hover:shadow-md"
              key={tile.title}
            >
              <tile.icon aria-hidden="true" className="text-[#3157a4]" size={24} />
              <h2 className="mt-4 text-xl font-semibold">{tile.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#60716b]">
                {tile.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
