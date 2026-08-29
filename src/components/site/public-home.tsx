"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  Lightbulb,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tile = {
  title: string;
  text: string;
  icon: LucideIcon;
};

const workflow = [
  "Idea Poster",
  "Idea",
  "Investment Interest",
  "Connection",
  "Investment",
];

const roleTiles: Tile[] = [
  {
    title: "Idea posters",
    text: "Publish serious ideas, understand engagement, and move qualified interest into collaboration.",
    icon: Lightbulb,
  },
  {
    title: "Investors",
    text: "Discover ideas, build a watchlist, express interest, and manage connections before portfolio records.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Mentors",
    text: "Find founders by domain, offer structured guidance, and support progress without pretending every match is funding.",
    icon: UsersRound,
  },
];

const principles: Tile[] = [
  {
    title: "Interest is not investment",
    text: "The first signal creates an investment interest record. Actual investments stay separate.",
    icon: ShieldCheck,
  },
  {
    title: "Role-aware product logic",
    text: "Idea posters, investors, mentors, and admins each get distinct routes, data, and workflows.",
    icon: Compass,
  },
  {
    title: "Designed for trust",
    text: "Public discovery can feel energetic while private financial and relationship data stays protected.",
    icon: CheckCircle2,
  },
];

const navItems = [
  { label: "Explore", href: "/explore" },
  { label: "Ideas", href: "/ideas" },
  { label: "Investors", href: "/investors" },
  { label: "Mentors", href: "/mentors" },
];

export function PublicHome() {
  const reduceMotion = useReducedMotion();
  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f3ed] text-[#101817]">
      <header className="absolute left-0 right-0 top-0 z-30">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link className="flex items-center gap-2 text-lg font-semibold" href="/">
            <span className="grid size-9 place-items-center rounded-lg bg-[#1f7a5a] text-white">
              <Sparkles aria-hidden="true" size={18} />
            </span>
            SparkHub
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#314641] transition hover:bg-white/70"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#314641] transition hover:bg-white/70 sm:inline-flex"
              href="/login"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-lg bg-[#101817] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f7a5a]"
              href="/signup"
            >
              Join
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative isolate min-h-[92svh] overflow-hidden">
        <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[64%]">
          <Image
            alt="SparkHub product network visual connecting ideas, investor interest, mentors, and collaboration paths"
            className="h-full w-full object-cover object-center opacity-80"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 64vw"
            src="/images/sparkhub-hero-network.png"
          />
          <div className="absolute inset-0 bg-[#f6f3ed]/78 lg:bg-[#f6f3ed]/28" />
          <div className="absolute inset-y-0 left-0 hidden w-2/5 bg-[#f6f3ed] lg:block" />
        </div>

        <motion.div
          animate="visible"
          className="mx-auto flex min-h-[92svh] w-full max-w-7xl flex-col justify-end px-5 pb-8 pt-28 sm:px-8 lg:justify-center lg:pb-12"
          initial="hidden"
          transition={{ staggerChildren: reduceMotion ? 0 : 0.08 }}
        >
          <motion.p
            className="max-w-fit rounded-full border border-[#cfb574] bg-white/70 px-3 py-1 text-xs font-semibold uppercase text-[#765411]"
            variants={reveal}
          >
            Built for idea discovery, not investment shortcuts
          </motion.p>
          <motion.h1
            className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-[#101817] sm:text-6xl lg:text-7xl"
            variants={reveal}
          >
            SparkHub turns promising ideas into trusted momentum.
          </motion.h1>
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-[#41534d] sm:text-xl"
            variants={reveal}
          >
            A role-aware platform where creators, investors, mentors, and admins
            work through clear stages from idea publishing to interest,
            connection, and only then investment records.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            variants={reveal}
          >
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[#1f7a5a]/20 transition hover:-translate-y-0.5 hover:bg-[#16664a]"
              href="/explore"
            >
              Explore ideas
              <Compass aria-hidden="true" size={17} />
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#b9c8c2] bg-white/75 px-5 py-3 text-sm font-semibold text-[#223630] transition hover:-translate-y-0.5 hover:border-[#1f7a5a]"
              href="/signup"
            >
              Start with your role
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </motion.div>
        </motion.div>

        <div className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8">
          <div className="grid gap-2 rounded-lg border border-[#d9d2c4] bg-white/82 p-2 shadow-sm backdrop-blur md:grid-cols-5">
            {workflow.map((step, index) => (
              <div
                className="flex min-h-20 items-center justify-between rounded-md px-4 py-3 text-sm font-semibold text-[#20322d] md:block"
                key={step}
              >
                <span className="block text-xs font-semibold uppercase text-[#5e716b]">
                  0{index + 1}
                </span>
                <span className="mt-1 block">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#ded7ca] bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
              Distinct experiences
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[#101817] sm:text-4xl">
              The sidebar is not the architecture.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#60716b]">
              SparkHub keeps the business logic aligned with what each person is
              actually doing, so the product can grow without a painful rewrite.
            </p>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {roleTiles.map((tile) => (
              <article
                className="rounded-lg border border-[#dfe5e1] bg-[#fbfcfb] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#8eb9aa] hover:shadow-md"
                key={tile.title}
              >
                <tile.icon
                  aria-hidden="true"
                  className="text-[#3157a4]"
                  size={26}
                />
                <h3 className="mt-5 text-xl font-semibold text-[#101817]">
                  {tile.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#60716b]">
                  {tile.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#101817] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-[#d4912a]">
              Platform spine
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Designed around the real journey.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#c9d8d2]">
              Ideas can be public. Interest can be private. Connections can be
              mutual. Investments are a separate, deliberate record.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {principles.map((tile) => (
              <article
                className="rounded-lg border border-white/12 bg-white/[0.06] p-5"
                key={tile.title}
              >
                <tile.icon
                  aria-hidden="true"
                  className="text-[#d4912a]"
                  size={24}
                />
                <h3 className="mt-4 text-lg font-semibold">{tile.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#c9d8d2]">
                  {tile.text}
                </p>
              </article>
            ))}
            <article className="rounded-lg border border-[#5673b6] bg-[#3157a4] p-5">
              <MessageSquareText aria-hidden="true" size={24} />
              <h3 className="mt-4 text-lg font-semibold">Discussion before deal</h3>
              <p className="mt-2 text-sm leading-6 text-[#eaf0ff]">
                Connection and collaboration workflows come before any portfolio
                or investment record is created.
              </p>
            </article>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ded7ca] bg-[#f6f3ed] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[#60716b] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold text-[#101817]">SparkHub</span>
          <div className="flex flex-wrap gap-4">
            {navItems.map((item) => (
              <Link className="hover:text-[#1f7a5a]" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
