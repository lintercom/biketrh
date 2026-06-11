import Link from "next/link";
import Image from "next/image";
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
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-line bg-white shadow-soft">
      <Link href={`/inzeraty/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] bg-fog">
          {mainImage ? (
            <Image src={mainImage} alt={listing.title} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
          ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-lg text-zinc-500">
              Fotografie bude doplněna
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link href={`/inzeraty/${listing.id}`} className="line-clamp-2 min-h-12 text-lg font-semibold leading-6 text-ink hover:text-moss sm:min-h-[3.5rem] md:text-[19px] md:leading-7">
              {listing.title}
            </Link>
            <p className="mt-2 text-2xl font-black text-ink">{formatPrice(listing.price)}</p>
          </div>
          {showStatus ? (
            <span className="shrink-0 rounded-full bg-fog px-2.5 py-1.5 text-sm font-semibold text-zinc-700">
              {listing.status === "active" ? "Aktivní" : listing.status === "reserved" ? "Rezervováno" : listing.status === "sold" ? "Prodáno" : "Skryto"}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex min-w-0 items-center gap-2 text-[17px] text-zinc-600">
          <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 truncate">{listing.location}</span>
        </div>

        <Link href={`/uzivatel/${listing.seller.id}`} className="mt-auto flex min-w-0 items-center gap-2.5 pt-4 text-[17px]">
          <Avatar profile={listing.seller} size="sm" />
          <span className="min-w-0 flex-1 truncate text-zinc-700">{listing.seller.display_name}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-zinc-600">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />
            {formatRating(listing.seller)}
          </span>
        </Link>

        {actions ? <div className="pt-4">{actions}</div> : null}
      </div>
    </article>
  );
}
