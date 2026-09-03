import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

type EmptyWorkflowProps = {
  title: string;
  text: string;
  href?: string;
  linkLabel?: string;
};

export function EmptyWorkflow({
  title,
  text,
  href,
  linkLabel,
}: EmptyWorkflowProps) {
  return (
    <article className="rounded-lg border border-dashed border-[#bdccc6] bg-[#fbfcfb] p-6">
      <ShieldCheck aria-hidden="true" className="text-[#3157a4]" size={26} />
      <h2 className="mt-4 text-2xl font-semibold text-[#101817]">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#60716b]">{text}</p>
      {href && linkLabel ? (
        <Link
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#cfdad5] bg-white px-4 py-2 text-sm font-semibold text-[#263b35] transition hover:border-[#1f7a5a]"
          href={href}
        >
          {linkLabel}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </article>
  );
}
