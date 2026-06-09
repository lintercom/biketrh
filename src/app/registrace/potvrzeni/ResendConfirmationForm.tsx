"use client";

import { FormEvent, useState } from "react";
import { MailCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ResendConfirmationForm({ email }: { email: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase není nakonfigurovaný.");
      return;
    }

    setPending(true);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    setPending(false);

    if (resendError) {
      if (resendError.status === 429) {
        setError("Email jsme už odeslali. Zkuste to prosím znovu za chvíli.");
      } else {
        setError("Potvrzovací email se nepovedlo odeslat znovu.");
      }
      return;
    }

    setMessage("Poslali jsme nový potvrzovací email.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      {message ? <div className="rounded-lg border border-line bg-white p-4 text-sm text-zinc-700">{message}</div> : null}
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-moss bg-white px-5 py-3 text-sm font-semibold text-moss hover:bg-[#fff7df] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <MailCheck className="h-4 w-4" aria-hidden="true" />
        {pending ? "Odesílám..." : "Poslat email znovu"}
      </button>
    </form>
  );
}
