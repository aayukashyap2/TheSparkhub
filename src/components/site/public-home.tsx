"use client";

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
import { SparkOrbitScene } from "@/components/site/spark-orbit-scene";
import type { LucideIcon } from "lucide-react";

type Tile = {
  title: string;
  text: string;
  icon: LucideIcon;
};

const workflow = [
  {
    label: "Idea Poster",
    text: "Creates and owns the spark.",
  },
  {
    label: "Idea",
    text: "Published for discovery.",
  },
  {
    label: "Investor Interest",
    text: "Intent signal, not a deal.",
  },
  {
    label: "Connection",
    text: "Both sides can talk.",
  },
  {
    label: "Investment",
    text: "Recorded separately later.",
  },
];

const roleTiles: Tile[] = [
  {
    title: "Idea posters",
    text: "Publish, measure real attention, and move only qualified interest into collaboration.",
    icon: Lightbulb,
  },
  {
    title: "Investors",
    text: "Discover ideas, save a watchlist, express interest, and connect before portfolio work.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Mentors",
    text: "Find founders by stage and domain, then help the idea become sharper before funding talk.",
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
    title: "Role-aware logic",
    text: "Creators, investors, mentors, and admins each get distinct routes, data, and workflows.",
    icon: Compass,
  },
  {
    title: "Designed for trust",
    text: "Public discovery can feel energetic while private relationship and financial data stays protected.",
    icon: CheckCircle2,
  },
];

const navItems = [
  { label: "Explore", href: "/explore" },
  { label: "Ideas", href: "/ideas" },
  { label: "Investors", href: "/investors" },
  { label: "Mentors", href: "/mentors" },
];

const signalChips = ["Idea", "Interest", "Connection", "Investment"];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/aayukashyap2/TheSparkhub", mark: "GH" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", mark: "in" },
  { label: "Instagram", href: "https://www.instagram.com/", mark: "IG" },
  { label: "X", href: "https://x.com/", mark: "X" },
];

export function PublicHome() {
  const reduceMotion = useReducedMotion();
  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };
  const scrollReveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 44 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#edf4f0] text-[#101817]">
      <section className="relative isolate min-h-[680px] overflow-hidden lg:min-h-[760px]">
        <SparkOrbitScene className="pointer-events-none absolute left-0 top-0 z-0 h-[680px] w-full opacity-100 lg:h-[760px]" />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,#edf4f0_0%,rgba(237,244,240,0.95)_34%,rgba(237,244,240,0.58)_60%,rgba(237,244,240,0.22)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-0 h-36 bg-[linear-gradient(0deg,#edf4f0_0%,rgba(237,244,240,0)_100%)]" />

        <header className="absolute left-0 right-0 top-0 z-30 px-4 pt-4 sm:px-6">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-3 rounded-lg border border-white/70 bg-white/55 px-3 py-2 shadow-lg shadow-[#60716b]/10 backdrop-blur-2xl">
            <Link className="flex shrink-0 items-center gap-2 text-base font-semibold" href="/">
              <span className="grid size-9 place-items-center rounded-lg bg-[#1f7a5a] text-white shadow-sm shadow-[#1f7a5a]/30">
                <Sparkles aria-hidden="true" size={18} />
              </span>
              SparkHub
            </Link>
            <nav className="hidden flex-1 items-center justify-center gap-1 min-[520px]:flex">
              {navItems.map((item) => (
                <Link
                  className="rounded-md px-3 py-2 text-sm font-semibold text-[#314641] transition hover:bg-white/80"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Link
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#314641] transition hover:bg-white/70 sm:inline-flex"
                href="/login"
              >
                Sign in
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-lg bg-[#101817] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#101817]/15 transition hover:-translate-y-0.5 hover:bg-[#1f7a5a]"
                href="/signup"
              >
                Join
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
        </header>

        <motion.div
          animate="visible"
          className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-6 px-5 pb-8 pt-28 sm:px-8 lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr] lg:pt-24 max-h-[560px]:items-start max-h-[560px]:pt-24"
          initial="hidden"
          transition={{ staggerChildren: reduceMotion ? 0 : 0.08 }}
        >
          <div className="relative max-w-3xl">
            <div className="absolute -inset-x-4 -inset-y-5 -z-10 rounded-lg bg-[#edf4f0]/68 blur-2xl sm:-inset-x-8 sm:-inset-y-7" />
            <motion.p
              className="max-w-fit rounded-full border border-[#cfb574] bg-white/70 px-3 py-1 text-xs font-semibold uppercase text-[#765411] shadow-sm backdrop-blur-xl"
              variants={reveal}
            >
              Ideas, people, momentum
            </motion.p>
            <motion.h1
              className="mt-5 max-w-2xl text-[2.65rem] font-semibold leading-[1.04] tracking-normal text-[#101817] sm:text-5xl lg:text-[3.25rem] max-h-[560px]:mt-3 max-h-[560px]:text-3xl"
              variants={reveal}
            >
              Turn a spark into the right conversation.
            </motion.h1>
            <motion.p
              className="mt-5 max-w-xl text-base leading-7 text-[#41534d] sm:text-lg max-h-[560px]:mt-3 max-h-[560px]:text-sm max-h-[560px]:leading-6"
              variants={reveal}
            >
              Publish the idea, let investors signal interest, then connect
              when both sides are ready.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row max-h-[560px]:mt-4"
              variants={reveal}
            >
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1f7a5a]/25 transition hover:-translate-y-0.5 hover:bg-[#16664a]"
                href="/explore"
              >
                Explore ideas
                <Compass aria-hidden="true" size={17} />
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/62 px-5 py-3 text-sm font-semibold text-[#223630] shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#1f7a5a]"
                href="/signup"
              >
                Start with your role
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </motion.div>

            <motion.div className="mt-7 flex flex-wrap gap-2 max-h-[560px]:mt-4" variants={reveal}>
              {signalChips.map((chip, index) => (
                <motion.span
                  animate={
                    reduceMotion
                      ? undefined
                      : { y: [0, -5, 0], opacity: [0.8, 1, 0.8] }
                  }
                  className="rounded-full border border-white/80 bg-white/68 px-3 py-1.5 text-xs font-semibold text-[#314641] shadow-sm backdrop-blur-xl"
                  key={chip}
                  transition={{
                    delay: index * 0.18,
                    duration: 2.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  {chip}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <motion.div className="relative min-h-48 sm:min-h-[280px] lg:min-h-[390px]" variants={reveal}>
            <div className="absolute inset-x-3 bottom-8 top-10 rounded-lg border border-white/40 bg-white/18 shadow-2xl shadow-[#3157a4]/10 backdrop-blur-[2px] lg:inset-x-10" />
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -12, 0], rotate: [0, 1.4, 0] }
              }
              className="absolute right-0 top-2 w-56 rounded-lg border border-white/72 bg-white/58 p-4 shadow-2xl shadow-[#3157a4]/12 backdrop-blur-2xl sm:w-72 sm:p-5 lg:right-4 lg:top-14"
              transition={{ duration: 4.4, ease: "easeInOut", repeat: Infinity }}
            >
              <p className="text-xs font-semibold uppercase text-[#1f7a5a]">
                Live signal
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Interest is tracked.</h2>
              <p className="mt-2 text-sm leading-6 text-[#556963]">
                Connections happen after intent is clear.
              </p>
            </motion.div>
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
              className="absolute bottom-2 left-0 w-56 rounded-lg border border-white/72 bg-[#101817]/84 p-4 text-white shadow-2xl shadow-[#101817]/18 backdrop-blur-2xl sm:left-8 sm:w-64 sm:p-5 lg:bottom-16"
              transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            >
              <p className="text-xs font-semibold uppercase text-[#d4912a]">
                Clean workflow
              </p>
              <p className="mt-3 text-sm leading-6 text-[#d8e5df]">
                Idea to interest to connection. Investment stays separate.
              </p>
            </motion.div>
            <motion.div
              animate={reduceMotion ? undefined : { x: [0, 16, 0], opacity: [0.68, 1, 0.68] }}
              className="absolute left-20 top-1/2 hidden h-px w-52 bg-gradient-to-r from-[#d4912a] via-[#1f7a5a] to-transparent sm:block"
              transition={{ duration: 3.8, ease: "easeInOut", repeat: Infinity }}
            />
            <motion.div
              animate={reduceMotion ? undefined : { x: [0, -18, 0], opacity: [0.48, 0.9, 0.48] }}
              className="absolute right-16 top-24 hidden h-px w-48 bg-gradient-to-r from-transparent via-[#3157a4] to-[#8eb9aa] sm:block"
              transition={{ duration: 4.2, ease: "easeInOut", repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8 max-h-[560px]:hidden">
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/70 bg-white/62 p-2 shadow-xl shadow-[#60716b]/10 backdrop-blur-2xl min-[900px]:grid-cols-5">
            {workflow.map((step, index) => (
              <motion.div
                className="min-h-24 rounded-md px-4 py-3 text-sm text-[#20322d] transition hover:bg-white/80"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                key={step.label}
                transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <span className="block text-xs font-semibold uppercase text-[#5e716b]">
                  0{index + 1}
                </span>
                <span className="mt-2 block font-semibold">{step.label}</span>
                <span className="mt-1 block text-xs leading-5 text-[#60716b]">
                  {step.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        className="relative border-y border-[#ded7ca] bg-white px-5 py-11 sm:px-8"
        initial="hidden"
        transition={{ duration: 0.58, ease: "easeOut" }}
        variants={scrollReveal}
        viewport={{ amount: 0.24, once: true }}
        whileInView="visible"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(31,122,90,0.12),transparent_28%),radial-gradient(circle_at_15%_92%,rgba(49,87,164,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-[#1f7a5a]">
              Distinct experiences
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal text-[#101817] sm:text-3xl">
              Every role gets a real path.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#60716b]">
              SparkHub gives creators, investors, mentors, and admins different
              workspaces because each person is trying to make a different kind
              of progress.
            </p>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {roleTiles.map((tile, index) => (
              <motion.article
                className="rounded-lg border border-[#dfe5e1] bg-white/72 p-6 shadow-lg shadow-[#60716b]/8 backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#8eb9aa] hover:shadow-xl"
                initial={{ opacity: 0, rotateX: reduceMotion ? 0 : 8, y: 30 }}
                key={tile.title}
                transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
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
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="relative overflow-hidden bg-[#101817] px-5 py-11 text-white sm:px-8"
        initial="hidden"
        transition={{ duration: 0.58, ease: "easeOut" }}
        variants={scrollReveal}
        viewport={{ amount: 0.18, once: true }}
        whileInView="visible"
      >
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : { x: ["-8%", "8%", "-8%"], opacity: [0.2, 0.42, 0.2] }
          }
          className="absolute left-0 top-24 h-px w-full bg-[#8eb9aa]/45"
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-[#d4912a]">
              Platform spine
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal sm:text-3xl">
              Designed around the real journey.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#c9d8d2]">
              Ideas can be public. Interest can be private. Connections can be
              mutual. Investments are a separate, deliberate record.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {principles.map((tile, index) => (
              <motion.article
                className="rounded-lg border border-white/12 bg-white/[0.07] p-5 shadow-xl shadow-black/10 backdrop-blur-xl"
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: 28 }}
                key={tile.title}
                transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
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
              </motion.article>
            ))}
            <motion.article
              className="rounded-lg border border-[#5673b6] bg-[#3157a4] p-5 shadow-xl shadow-[#3157a4]/25"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: 28 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
            >
              <MessageSquareText aria-hidden="true" size={24} />
              <h3 className="mt-4 text-lg font-semibold">Discussion before deal</h3>
              <p className="mt-2 text-sm leading-6 text-[#eaf0ff]">
                Connection and collaboration workflows come before any portfolio
                or investment record is created.
              </p>
            </motion.article>
          </div>
        </div>
      </motion.section>

      <footer className="border-t border-[#ded7ca] bg-[#f6f3ed] px-5 py-6 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 text-sm text-[#60716b] md:grid-cols-[1.15fr_0.75fr_0.75fr_0.8fr]">
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
            <p className="mt-3 leading-6">Contact: hello@sparkhub.demo</p>
          </div>
        </div>
        <div className="mx-auto mt-5 flex max-w-7xl flex-col gap-3 border-t border-[#ded7ca] pt-4 text-xs text-[#60716b] sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 SparkHub. All rights reserved to @aayush Kumar.</p>
          <p>Demo build for TheSparkhub.</p>
        </div>
      </footer>
    </main>
  );
}
