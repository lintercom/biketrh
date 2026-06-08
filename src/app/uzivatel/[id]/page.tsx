import { notFound } from "next/navigation";
import { MapPin, Star } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/ListingCard";
import { formatRating } from "@/lib/format";
import { getPublicProfile } from "@/lib/data";
import { demoProfiles } from "@/lib/mock-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return demoProfiles.map((profile) => ({ id: profile.id }));
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { id } = await params;
  const { profile, listings } = await getPublicProfile(id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 md:px-6 md:py-10">
      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center gap-4">
          <Avatar profile={profile} size="lg" />
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-black text-ink">{profile.display_name}</h1>
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-zinc-600">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {profile.city}
            </p>
            <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-zinc-700">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              {formatRating(profile)}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-moss">Aktivní nabídky</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">Inzeráty uživatele</h2>
        </div>
      </div>

      {listings.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState title="Žádné aktivní inzeráty" text="Uživatel teď nemá žádné veřejné nabídky." />
        </div>
      )}
    </div>
  );
}
