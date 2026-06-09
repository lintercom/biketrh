"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function textField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function LoginForm({ next = "/profil", email = "" }: { next?: string; email?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const emailValue = textField(formData, "email");
    const password = textField(formData, "password");

    if (!emailValue || !password) {
      setError("Vyplňte email a heslo.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase není nakonfigurovaný.");
      return;
    }

    setPending(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: emailValue,
      password
    });

    if (signInError) {
      setPending(false);
      const message = signInError.message.toLowerCase();

      if (message.includes("email not confirmed") || message.includes("not confirmed")) {
        router.push(`/registrace/potvrzeni?email=${encodeURIComponent(emailValue)}`);
        return;
      }

      setError("Přihlášení se nepovedlo. Zkontrolujte email a heslo.");
      return;
    }

    router.push(next.startsWith("/") && !next.startsWith("//") ? next : "/profil");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4 rounded-lg border border-line bg-white p-4 shadow-soft sm:p-5">
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" defaultValue={email} className="mt-2 px-3 py-3" />
      </div>
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="password">
          Heslo
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
          className="mt-2 px-3 py-3"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {pending ? "Přihlašuji..." : "Přihlásit"}
      </button>
    </form>
  );
}
