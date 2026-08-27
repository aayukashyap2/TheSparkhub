export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#171717]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-8 lg:px-12">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f6f62]">
          SparkHub foundation
        </p>
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-normal text-[#101817] sm:text-6xl lg:text-7xl">
            Turn Ideas Into Impact.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#45534f] sm:text-xl">
            SparkHub is being built as a real idea discovery, collaboration,
            mentorship, and investor discovery platform. Phase 1 is focused on
            the foundations that keep the product honest as it grows.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Architecture",
              text: "Idea posters, investors, mentors, and admins have distinct workflows.",
            },
            {
              label: "Investment Safety",
              text: "Interest, connection, and investment are separate business entities.",
            },
            {
              label: "Verified Phases",
              text: "Each phase ends with working code, checks, and clear acceptance criteria.",
            },
          ].map((item) => (
            <article
              className="rounded-lg border border-[#d9d0c0] bg-white/70 p-5 shadow-sm"
              key={item.label}
            >
              <h2 className="text-base font-semibold text-[#13211f]">
                {item.label}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#596460]">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
