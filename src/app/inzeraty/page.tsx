import { SlidersHorizontal } from "lucide-react";
import { ConfigNotice } from "@/components/ConfigNotice";
import { ListingCard } from "@/components/ListingCard";
import { getListings } from "@/lib/data";

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 md:px-6 md:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-moss">Komponenty</p>
          <h1 className="mt-1 text-3xl font-black text-ink">Inzeráty</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
            Nejnovější nabídky cyklo komponentů od lidí z bike komunity.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-zinc-700">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Nejnovější první
        </div>
      </div>

      <div className="mt-5">
        <ConfigNotice />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
