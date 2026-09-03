"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  name?: string;
  variant?: "primary" | "secondary";
  value?: string;
};

export function SubmitButton({
  children,
  name,
  variant = "primary",
  value,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const className =
    variant === "primary"
      ? "bg-[#10231f] text-white shadow-sm hover:bg-[#1c3b33]"
      : "border border-[#ccd6d1] bg-white text-[#1c2c28] hover:border-[#8faf9f]";

  return (
    <button
      className={`inline-flex h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold transition ${className} disabled:cursor-not-allowed disabled:opacity-65`}
      disabled={pending}
      name={name}
      type="submit"
      value={value}
    >
      {pending ? "Working..." : children}
    </button>
  );
}
