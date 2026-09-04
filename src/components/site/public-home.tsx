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
  MapPin,
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

const signalChips = ["Post", "Watch", "Connect"];

const signalLines = [
  "left-[8%] top-[28%] w-32 bg-[#1f7a5a]/35",
  "right-[10%] top-[24%] w-44 bg-[#3157a4]/28",
  "bottom-[26%] left-[14%] w-40 bg-[#d4912a]/35",
  "bottom-[18%] right-[18%] w-36 bg-[#1f7a5a]/30",
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/aayukashyap2/TheSparkhub", mark: "GH" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", mark: "in" },
  { label: "Instagram", href: "https://www.instagram.com/", mark: "IG" },
  { label: "X", href: "https://x.com/", mark: "X" },
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
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link className="flex items-center gap-2 text-base font-semibold" href="/">
            <span className="grid size-8 place-items-center rounded-lg bg-[#1f7a5a] text-white">
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

      <section className="relative isolate min-h-svh overflow-hidden">
        <motion.div
          animate={reduceMotion ? undefined : { scale: [1.02, 1] }}
          className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[64%]"
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
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
        </motion.div>
        <div className="pointer-events-none absolute inset-0 -z-10">
          {signalLines.map((line, index) => (
            <motion.span
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: [0.2, 0.72, 0.2],
                      x: index % 2 === 0 ? [0, 22, 0] : [0, -22, 0],
                    }
              }
              className={`absolute h-px ${line}`}
              key={line}
              transition={{
                delay: index * 0.32,
                duration: 3.4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          ))}
          <motion.span
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.18, 0.42, 0.18], x: ["-20%", "20%", "-20%"] }
            }
            className="absolute left-0 top-[44%] h-px w-full bg-[#1f7a5a]/18"
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
          />
        </div>

        <motion.div
          animate="visible"
          className="mx-auto flex min-h-[calc(100svh-112px)] w-full max-w-7xl flex-col justify-center px-5 pb-7 pt-24 sm:px-8 lg:pb-8"
          initial="hidden"
          transition={{ staggerChildren: reduceMotion ? 0 : 0.08 }}
        >
          <motion.p
            className="max-w-fit rounded-full border border-[#cfb574] bg-white/70 px-3 py-1 text-xs font-semibold uppercase text-[#765411]"
            variants={reveal}
          >
            Ideas, people, momentum
          </motion.p>
          <motion.h1
            className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-normal text-[#101817] sm:text-5xl lg:text-6xl"
            variants={reveal}
          >
            Where ideas find the right people.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-xl text-base leading-7 text-[#41534d] sm:text-lg"
            variants={reveal}
          >
            Post a spark. Save what matters. Start the right conversation when
            the timing feels real.
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

          <motion.div
            className="mt-10 flex flex-wrap gap-2"
            variants={reveal}
          >
            {signalChips.map((chip, index) => (
              <motion.span
                animate={
                  reduceMotion ? undefined : { y: [0, -5, 0], opacity: [0.8, 1, 0.8] }
                }
                className="rounded-full border border-white/80 bg-white/72 px-3 py-1.5 text-xs font-semibold text-[#314641] shadow-sm backdrop-blur"
                key={chip}
                transition={{
                  delay: index * 0.2,
                  duration: 2.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                {chip}
              </motion.span>
            ))}
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

      <section className="border-y border-[#ded7ca] bg-white px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
              Distinct experiences
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[#101817] sm:text-4xl">
              Every role gets a real path.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#60716b]">
              SparkHub gives creators, investors, mentors, and admins different
              workspaces because each person is trying to make a different kind
              of progress.
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

      <section className="bg-[#101817] px-5 py-12 text-white sm:px-8">
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
        <div className="mx-auto grid max-w-7xl gap-6 text-sm text-[#60716b] md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link
              className="inline-flex items-center gap-2 text-base font-semibold text-[#101817]"
              href="/"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-[#1f7a5a] text-white">
                <Sparkles aria-hidden="true" size={18} />
              </span>
              SparkHub
            </Link>
            <p className="mt-3 max-w-sm leading-6">
              A demo platform for turning early ideas into clearer discovery,
              interest, and connection workflows.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-[#40554f]">
              <MapPin aria-hidden="true" size={16} />
              Demo location: New Delhi, India
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#101817]">Product</h2>
            <div className="mt-3 grid gap-2.5">
              {navItems.map((item) => (
                <Link
                  className="transition hover:text-[#1f7a5a]"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-[#101817]">Account</h2>
            <div className="mt-3 grid gap-2.5">
              <Link className="transition hover:text-[#1f7a5a]" href="/login">
                Sign in
              </Link>
              <Link className="transition hover:text-[#1f7a5a]" href="/signup">
                Join SparkHub
              </Link>
              <Link className="transition hover:text-[#1f7a5a]" href="/app">
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-[#101817]">Social</h2>
            <div className="mt-3 flex gap-2">
              {socialLinks.map((item) => (
                <a
                  aria-label={`${item.label} demo link`}
                  className="grid size-9 place-items-center rounded-lg border border-[#cfd8d2] bg-white text-[#263b35] transition hover:border-[#1f7a5a] hover:text-[#1f7a5a]"
                  href={item.href}
                  key={item.label}
                  rel="noreferrer"
                  target="_blank"
                  title={`${item.label} demo link`}
                >
                  <span aria-hidden="true" className="text-xs font-bold">
                    {item.mark}
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-3 leading-6">
              Contact, privacy, terms, and help center pages are planned for the
              production launch phase.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-3 border-t border-[#ded7ca] pt-4 text-xs text-[#60716b] sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 SparkHub. All rights reserved to @aayush Kumar.</p>
          <p>Demo build for TheSparkhub.</p>
        </div>
      </footer>
    </main>
  );
}
