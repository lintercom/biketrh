"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function textField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function RegistrationForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = textField(formData, "email");
    const password = textField(formData, "password");
    const displayName = textField(formData, "display_name");
    const city = textField(formData, "city");

    if (!email || !password || !displayName || !city) {
      setError("Vyplňte email, heslo, zobrazované jméno a město.");
      return;
    }

    if (password.length < 6) {
      setError("Heslo musí mít alespoň 6 znaků.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase není nakonfigurovaný.");
      return;
    }

    setPending(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          display_name: displayName,
          city
        }
      }
    });

    if (signUpError) {
      setPending(false);
      setError("Registrace se nepovedla. Zkuste jiný email nebo silnější heslo.");
      return;
    }

    if (data.session && data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        display_name: displayName,
        city
      });

      if (profileError) {
        setPending(false);
        setError("Účet je vytvořený, ale profil se nepovedlo uložit.");
        return;
      }

      router.push("/profil");
      router.refresh();
      return;
    }

    router.push("/prihlaseni?zprava=Registrace je vytvořená. Pokud Supabase vyžaduje ověření, potvrďte email.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4 rounded-lg border border-line bg-white p-5 shadow-soft">
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}

      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="mt-2 px-3 py-3" />
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
          autoComplete="new-password"
          className="mt-2 px-3 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="display_name">
          Zobrazované jméno
        </label>
        <input id="display_name" name="display_name" required minLength={2} maxLength={80} className="mt-2 px-3 py-3" />
      </div>

      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="city">
          Město
        </label>
        <input id="city" name="city" required minLength={2} maxLength={120} className="mt-2 px-3 py-3" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
      >
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        {pending ? "Vytvářím účet..." : "Registrovat"}
      </button>
    </form>
  );
}
