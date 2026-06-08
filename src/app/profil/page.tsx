import Link from "next/link";
import { redirect } from "next/navigation";
import { List, LogOut, Save, ShoppingBag, Star } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { ConfigNotice } from "@/components/ConfigNotice";
import { SubmitButton } from "@/components/SubmitButton";
import { signOutAction, updateProfileAction } from "@/app/actions";
import { formatRating } from "@/lib/format";
import { getCurrentUserProfile } from "@/lib/data";

type PageProps = {
  searchParams: Promise<{ chyba?: string; zprava?: string }>;
};

export default async function ProfilePage({ searchParams }: PageProps) {
  const { user, profile } = await getCurrentUserProfile();
  const { chyba, zprava } = await searchParams;

  if (!user) {
    redirect("/prihlaseni?next=/profil");
  }

  const displayName = profile?.display_name ?? user.email?.split("@")[0] ?? "";
  const city = profile?.city ?? "";

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 md:px-6 md:py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-moss">Profil</p>
      <h1 className="mt-1 text-3xl font-black text-ink">Můj profil</h1>

      <div className="mt-5">
        <ConfigNotice />
      </div>

      {chyba ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div> : null}
      {zprava ? <div className="mt-5 rounded-lg border border-line bg-white p-4 text-sm text-zinc-700">{zprava}</div> : null}

      <section className="mt-5 rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center gap-4">
          <Avatar
            profile={{
              display_name: displayName,
              avatar_url: profile?.avatar_url ?? null
            }}
            size="lg"
          />
          <div>
            <h2 className="text-xl font-bold text-ink">{displayName || "Nový uživatel"}</h2>
            <p className="text-sm text-zinc-600">{city || "Město není vyplněné"}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-zinc-700">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              {profile ? formatRating(profile) : "Bez hodnocení"}
            </p>
          </div>
        </div>
      </section>

      <form action={updateProfileAction} className="mt-5 space-y-4 rounded-lg border border-line bg-white p-5 shadow-soft">
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="display_name">
            Zobrazované jméno
          </label>
          <input
            id="display_name"
            name="display_name"
            required
            minLength={2}
            maxLength={80}
            defaultValue={displayName}
            className="mt-2 px-3 py-3"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="city">
            Město
          </label>
          <input id="city" name="city" required minLength={2} maxLength={120} defaultValue={city} className="mt-2 px-3 py-3" />
        </div>
        <SubmitButton pendingText="Ukládám profil...">
          <span className="inline-flex items-center gap-2">
            <Save className="h-4 w-4" aria-hidden="true" />
            Uložit profil
          </span>
        </SubmitButton>
      </form>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link
          href="/moje-inzeraty"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-fog"
        >
          <List className="h-4 w-4" aria-hidden="true" />
          Moje inzeráty
        </Link>
        <Link
          href="/moje-objednavky"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-fog"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Moje objednávky
        </Link>
      </div>

      <form action={signOutAction} className="mt-4">
        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-fog"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Odhlásit
        </button>
      </form>
    </div>
  );
}
