import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { CheckCircle, Eye, EyeOff, Pencil, RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/ListingCard";
import { updateListingStatusAction } from "@/app/actions";
import { getCurrentUserProfile, getUserListings } from "@/lib/data";
import type { ListingStatus } from "@/lib/types";

type PageProps = {
  searchParams: Promise<{ chyba?: string; zprava?: string }>;
};

export default async function MyListingsPage({ searchParams }: PageProps) {
  const { user } = await getCurrentUserProfile();
  const { chyba, zprava } = await searchParams;

  if (!user) {
    redirect("/prihlaseni?next=/moje-inzeraty");
  }

  const listings = await getUserListings(user.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-5 md:px-6 md:py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-moss">Prodej</p>
      <h1 className="mt-1 text-2xl font-black text-ink sm:text-3xl">Moje inzeráty</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
        Spravujte aktivní nabídky, skryté inzeráty i komponenty, které už jsou prodané.
      </p>

      {chyba ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div> : null}
      {zprava ? <div className="mt-5 rounded-lg border border-line bg-white p-4 text-sm text-zinc-700">{zprava}</div> : null}

      {listings.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              showStatus
              actions={
                <div className="grid gap-2 min-[380px]:grid-cols-2">
                  <Link
                    href={`/moje-inzeraty/${listing.id}/upravit`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-fog"
                  >
                    <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Upravit
                  </Link>
                  {listing.status === "hidden" ? (
                    <ListingAction listingId={listing.id} status="active" label="Obnovit" icon={<RotateCcw className="h-4 w-4" />} />
                  ) : (
                    <ListingAction listingId={listing.id} status="hidden" label="Skrýt" icon={<EyeOff className="h-4 w-4" />} />
                  )}
                  {listing.status !== "sold" ? (
                    <ListingAction listingId={listing.id} status="sold" label="Prodáno" icon={<CheckCircle className="h-4 w-4" />} />
                  ) : (
                    <ListingAction listingId={listing.id} status="active" label="Aktivní" icon={<Eye className="h-4 w-4" />} />
                  )}
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="Zatím nic neprodáváte"
            text="Přidejte první komponent a nabídka se tady objeví."
            href="/pridat-inzerat"
            action="Přidat inzerát"
          />
        </div>
      )}
    </div>
  );
}

function ListingAction({
  listingId,
  status,
  label,
  icon
}: {
  listingId: string;
  status: ListingStatus;
  label: string;
  icon: ReactNode;
}) {
  return (
    <form action={updateListingStatusAction}>
      <input type="hidden" name="listing_id" value={listingId} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-fog"
      >
        {icon}
        {label}
      </button>
    </form>
  );
}
