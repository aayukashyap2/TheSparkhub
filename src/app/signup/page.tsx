import Link from "next/link";
import { SignUpForm } from "@/components/auth/auth-forms";
import { isSupabaseConfigured } from "@/lib/env";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#f6f4ef] px-5 py-10 text-[#13211f]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_430px]">
        <section>
          <Link className="text-lg font-semibold text-[#10231f]" href="/">
            SparkHub
          </Link>
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f7d68]">
            Join SparkHub
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight tracking-normal text-[#101817] md:text-6xl">
            Start with identity. Grow into the network.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#5f6f69]">
            Create an account, then choose whether you are posting ideas,
            discovering investments, or mentoring builders.
          </p>
        </section>
        <section>
          {!isSupabaseConfigured() ? (
            <p className="mb-4 rounded-lg border border-[#efc7ba] bg-[#fff5f1] px-4 py-3 text-sm leading-6 text-[#9c321f]">
              Add `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to `.env.local` before
              using signup.
            </p>
          ) : null}
          <SignUpForm />
        </section>
      </div>
    </main>
  );
}
