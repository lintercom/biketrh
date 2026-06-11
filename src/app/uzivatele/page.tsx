import Link from "next/link";
import { MapPin, Search, Star } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { formatRating } from "@/lib/format";
import { searchProfiles } from "@/lib/data";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function UsersPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const profiles = await searchProfiles(query);

  return (
    <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-5 md:px-8 md:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-base font-semibold uppercase tracking-wide text-moss">Uživatelé</p>
          <h1 className="mt-1 text-3xl font-black text-ink">{query ? `Uživatelé pro „${query}“` : "Uživatelé"}</h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-600">
            {query
              ? "Hledáme podle zobrazovaného jména a města. Profil otevřete pro přehled aktivních nabídek."
              : "Najděte prodejce a zobrazte si jejich aktivní nabídky."}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-base font-semibold text-zinc-700">
          <Search className="h-4 w-4" aria-hidden="true" />
          Hledání uživatelů
        </div>
      </div>

      {profiles.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {profiles.map((profile) => (
            <Link
              key={profile.id}
              href={`/uzivatel/${profile.id}`}
              className="flex items-center gap-4 rounded-lg border border-line bg-white p-4 shadow-soft hover:border-moss"
            >
              <Avatar profile={profile} size="lg" />
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-ink">{profile.display_name}</h2>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-zinc-600">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {profile.city || "Město není vyplněné"}
                </p>
                <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-zinc-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {formatRating(profile)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title={query ? "Žádní uživatelé nenalezeni" : "Zatím tu nejsou žádní uživatelé"}
            text={query ? "Zkuste hledat jiné jméno nebo město." : "Jakmile se někdo zaregistruje, zobrazí se tady."}
          />
        </div>
      )}
    </div>
  );
}
