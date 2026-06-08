"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

type SubmitButtonProps = {
  children: ReactNode;
  pendingText?: string;
  className?: string;
};

export function SubmitButton({ children, pendingText = "Ukládám...", className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
      }
    >
      {pending ? pendingText : children}
    </button>
  );
}
