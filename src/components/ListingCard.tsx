import Link from "next/link";
import type { ReactNode } from "react";
import { MapPin, Star } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { formatPrice, formatRating } from "@/lib/format";
import type { ListingWithDetails } from "@/lib/types";

type ListingCardProps = {
  listing: ListingWithDetails;
  showStatus?: boolean;
  actions?: ReactNode;
};

export function ListingCard({ listing, showStatus = false, actions }: ListingCardProps) {
  const mainImage = listing.images[0]?.image_url;

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
      <Link href={`/inzeraty/${listing.id}`} className="block">
        <div className="aspect-[4/3] bg-fog">
          {mainImage ? (
            <img src={mainImage} alt={listing.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-500">
              Fotografie bude doplněna
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/inzeraty/${listing.id}`} className="font-semibold text-ink hover:text-moss">
              {listing.title}
            </Link>
            <p className="mt-1 text-lg font-bold text-ink">{formatPrice(listing.price)}</p>
          </div>
          {showStatus ? (
            <span className="rounded-full bg-fog px-2 py-1 text-xs font-semibold text-zinc-700">
              {listing.status === "active" ? "Aktivní" : listing.status === "reserved" ? "Rezervováno" : listing.status === "sold" ? "Prodáno" : "Skryto"}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-zinc-600">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span>{listing.location}</span>
        </div>

        <Link href={`/uzivatel/${listing.seller.id}`} className="flex items-center gap-2 text-sm">
          <Avatar profile={listing.seller} size="sm" />
          <span className="min-w-0 flex-1 truncate text-zinc-700">{listing.seller.display_name}</span>
          <span className="inline-flex items-center gap-1 text-zinc-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            {formatRating(listing.seller)}
          </span>
        </Link>

        {actions ? <div className="pt-1">{actions}</div> : null}
      </div>
    </article>
  );
}
