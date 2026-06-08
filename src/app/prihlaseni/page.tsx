import Link from "next/link";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { ConfigNotice } from "@/components/ConfigNotice";
import { SubmitButton } from "@/components/SubmitButton";
import { getCurrentUserProfile } from "@/lib/data";

export default async function SignInPage() {
  const { user } = await getCurrentUserProfile();
  const next = "/profil";

  if (user) {
    redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/profil");
  }

  return (
    <div className="mx-auto flex min-h-[78vh] max-w-md flex-col justify-center px-5 py-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-moss">Přihlášení</p>
      <h1 className="mt-1 text-3xl font-black text-ink">Vítejte zpět</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">Přihlaste se a pokračujte v obchodování u konkrétních inzerátů.</p>

      <div className="mt-5">
        <ConfigNotice />
      </div>

      <form action="#" className="mt-5 space-y-4 rounded-lg border border-line bg-white p-5 shadow-soft">
        <input type="hidden" name="next" value={next} />
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
            autoComplete="current-password"
            className="mt-2 px-3 py-3"
          />
        </div>
        <SubmitButton pendingText="Přihlašuji...">
          <span className="inline-flex items-center gap-2">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Přihlásit
          </span>
        </SubmitButton>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-600">
        Nemáte účet?{" "}
        <Link href="/registrace" className="font-semibold text-moss hover:text-ink">
          Zaregistrovat se
        </Link>
      </p>
    </div>
  );
}
