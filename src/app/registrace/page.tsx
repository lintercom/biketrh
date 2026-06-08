import Link from "next/link";
import { redirect } from "next/navigation";
import { UserPlus } from "lucide-react";
import { ConfigNotice } from "@/components/ConfigNotice";
import { SubmitButton } from "@/components/SubmitButton";
import { getCurrentUserProfile } from "@/lib/data";

export default async function SignUpPage() {
  const { user } = await getCurrentUserProfile();

  if (user) {
    redirect("/profil");
  }

  return (
    <div className="mx-auto flex min-h-[78vh] max-w-md flex-col justify-center px-5 py-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-moss">Registrace</p>
      <h1 className="mt-1 text-3xl font-black text-ink">Vytvořit účet</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">Stačí email, heslo, zobrazované jméno a město.</p>

      <div className="mt-5">
        <ConfigNotice />
      </div>

      <form action="#" className="mt-5 space-y-4 rounded-lg border border-line bg-white p-5 shadow-soft">
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
        <SubmitButton pendingText="Vytvářím účet...">
          <span className="inline-flex items-center gap-2">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Registrovat
          </span>
        </SubmitButton>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-600">
        Už máte účet?{" "}
        <Link href="/prihlaseni" className="font-semibold text-moss hover:text-ink">
          Přihlásit se
        </Link>
      </p>
    </div>
  );
}
