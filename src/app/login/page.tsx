import Link from "next/link";
import { LoginForm } from "@/components/auth/auth-forms";
import { isSupabaseConfigured } from "@/lib/env";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
};

const messages: Record<string, string> = {
  "missing-config": "Add your Supabase publishable key to .env.local first.",
  "oauth-error": "Google sign-in could not start. Please try again.",
  "auth-error": "The auth link was invalid or expired.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/app";
  const message = params.message ? messages[params.message] : undefined;

  return (
    <AuthPageShell
      eyebrow="SparkHub access"
      title="Sign in to continue building."
      subtitle="Use email or Google to enter your role-aware SparkHub workspace."
    >
      {!isSupabaseConfigured() ? (
        <ConfigNotice />
      ) : message ? (
        <Notice>{message}</Notice>
      ) : null}
      <LoginForm nextPath={nextPath} />
    </AuthPageShell>
  );
}

function AuthPageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f6f4ef] px-5 py-10 text-[#13211f]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_430px]">
        <section>
          <Link className="text-lg font-semibold text-[#10231f]" href="/">
            SparkHub
          </Link>
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f7d68]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight tracking-normal text-[#101817] md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#5f6f69]">
            {subtitle}
          </p>
        </section>
        <section>{children}</section>
      </div>
    </main>
  );
}

function ConfigNotice() {
  return (
    <Notice>
      Supabase is connected in code, but `.env.local` still needs
      `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
    </Notice>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 rounded-lg border border-[#efc7ba] bg-[#fff5f1] px-4 py-3 text-sm leading-6 text-[#9c321f]">
      {children}
    </p>
  );
}
