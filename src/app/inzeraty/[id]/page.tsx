import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Flag, Heart, MapPin, MessageCircle, MoreVertical, ShieldCheck, Star } from "lucide-react";
import { clsx } from "clsx";
import { Avatar } from "@/components/Avatar";
import { SubmitButton } from "@/components/SubmitButton";
import { startOrderAction } from "@/app/actions";
import { conditionLabels, formatDate, formatPrice, formatRating } from "@/lib/format";
import { getCurrentUserProfile, getListingById } from "@/lib/data";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ chyba?: string }>;
};

export default async function ListingDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { chyba } = await searchParams;
  const listing = await getListingById(id);
  const { user } = await getCurrentUserProfile();

  if (!listing) {
    notFound();
  }

  const isOwner = user?.id === listing.seller_id;
  const canOrder = listing.status === "active" && !isOwner;
  const images = listing.images.length > 0 ? listing.images : [];
  const mainImage = images[0]?.image_url;
  const secondaryImages = images.slice(1, 3);
  const breadcrumbItems = [listing.category, listing.subcategory, listing.seller.display_name];

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-5 md:px-6 md:py-5">
      {chyba ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="min-w-0">
          <section className="grid gap-1 overflow-hidden rounded-lg md:grid-cols-2">
            <div className="relative min-h-[320px] bg-white md:min-h-[620px]">
              {mainImage ? (
                <Image src={mainImage} alt={listing.title} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              ) : (
                <div className="flex h-full min-h-[320px] items-center justify-center bg-fog text-sm text-zinc-500">Bez fotografie</div>
              )}
            </div>

            <div className="grid gap-1">
              {(secondaryImages.length > 0 ? secondaryImages : [images[0], images[0]].filter(Boolean)).slice(0, 2).map((image, index) => (
                <div key={image?.id ? `${image.id}-${index}` : `image-${index}`} className="relative min-h-[230px] bg-white md:min-h-0">
                  {image?.image_url ? (
                    <Image src={image.image_url} alt={listing.title} fill sizes="(min-width: 1024px) 28vw, 100vw" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-fog text-sm text-zinc-500">Bez fotografie</div>
                  )}
                  {index === 1 ? (
                    <div className="absolute bottom-4 right-4 inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink shadow-soft">
                      <Heart className="h-5 w-5" aria-hidden="true" />
                      {listing.seller.rating_count || ""}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <nav className="mt-4 flex flex-wrap items-center gap-2 text-[15px] text-zinc-600" aria-label="Drobečková navigace">
            {breadcrumbItems.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                <Link href={index === 0 ? `/inzeraty?category=${encodeURIComponent(listing.category)}` : "/inzeraty"} className="underline hover:text-moss">
                  {item}
                </Link>
                {index < breadcrumbItems.length - 1 ? <span>/</span> : null}
              </span>
            ))}
            <Flag className="ml-auto h-5 w-5 text-zinc-500" aria-hidden="true" />
          </nav>

        </div>

        <aside className="rounded-lg border border-line bg-white p-5 shadow-soft lg:sticky lg:top-36">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-semibold leading-snug text-ink">{listing.title}</h1>
              <p className="mt-1.5 text-base leading-6 text-zinc-600">
                {listing.category} · {listing.subcategory}
              </p>
              <p className="mt-1 text-[15px] text-zinc-600">Vystaveno {formatDate(listing.created_at)}</p>
            </div>
            <button type="button" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-600 hover:bg-fog" aria-label="Více možností">
              <MoreVertical className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5">
            <p className="text-[15px] text-zinc-500">{Math.max(0, Math.round(listing.price * 0.7)).toLocaleString("cs-CZ")} Kč</p>
            <p className="text-3xl font-black text-moss">{formatPrice(listing.price)}</p>
            <div className="mt-2 flex items-start gap-2 text-base text-moss">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Zahrnuje ochranu kupujících
            </div>
            <p className="mt-3 text-[15px] leading-6 text-zinc-600">Cena předmětu a relevantní poplatky jsou přepočteny na vaši měnu.</p>
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <InfoRow label="Značka" value={listing.seller.display_name} emphasize />
            <InfoRow label="Kategorie" value={listing.category} />
            <InfoRow label="Podkategorie" value={listing.subcategory} />
            <InfoRow label="Stav" value={conditionLabels[listing.condition]} />
            <InfoRow label="Lokalita" value={listing.location} icon={<MapPin className="h-4 w-4" />} />
            <InfoRow label="Vystaveno" value={formatDate(listing.created_at)} />
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <p className="whitespace-pre-line break-words text-base leading-7 text-zinc-700">{listing.description}</p>
            <Link href="#popis" className="mt-3 inline-flex text-base font-semibold text-moss underline hover:text-ink">
              ... více
            </Link>
          </div>

          <Link href={`/uzivatel/${listing.seller.id}`} className="mt-5 flex min-w-0 items-center gap-3 border-t border-line pt-4">
            <Avatar profile={listing.seller} size="lg" />
            <div className="min-w-0">
              <p className="truncate font-bold text-ink">{listing.seller.display_name}</p>
              <p className="truncate text-base text-zinc-600">{listing.seller.city}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-base font-semibold text-zinc-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                {formatRating(listing.seller)}
              </p>
            </div>
          </Link>

          <div className="mt-5 border-t border-line pt-4">
            <div className="mb-3 flex items-center justify-between text-base">
              <span className="font-semibold text-ink">Přeprava</span>
              <span className="text-zinc-600">od 79 Kč</span>
            </div>

            {!user ? (
              <div className="grid gap-2">
                <Link
                  href={`/prihlaseni?next=/inzeraty/${listing.id}`}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-moss px-5 py-3 text-base font-bold text-white hover:bg-ink"
                >
                  Koupit
                </Link>
                <Link
                  href={`/prihlaseni?next=/inzeraty/${listing.id}`}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-moss bg-white px-5 py-3 text-base font-bold text-moss hover:bg-[#fff7df]"
                >
                  Nabídnout cenu
                </Link>
                <Link
                  href={`/prihlaseni?next=/inzeraty/${listing.id}`}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-moss bg-white px-5 py-3 text-base font-bold text-moss hover:bg-[#fff7df]"
                >
                  Poslat dotaz
                </Link>
              </div>
            ) : isOwner ? (
              <p className="rounded-lg bg-fog p-4 text-base text-zinc-700">Toto je váš inzerát.</p>
            ) : canOrder ? (
              <div className="grid gap-2">
                <form action={startOrderAction}>
                  <input type="hidden" name="listing_id" value={listing.id} />
                  <input type="hidden" name="message" value="Dobrý den, mám zájem o tento inzerát." />
                  <SubmitButton
                    pendingText="Vytvářím rezervaci..."
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-moss px-5 py-3 text-base font-bold text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Koupit
                  </SubmitButton>
                </form>
                <button
                  type="button"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-moss bg-white px-5 py-3 text-base font-bold text-moss hover:bg-[#fff7df]"
                >
                  Nabídnout cenu
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-moss bg-white px-5 py-3 text-base font-bold text-moss hover:bg-[#fff7df]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Poslat dotaz
                </button>
              </div>
            ) : (
              <p className="rounded-lg bg-fog p-4 text-base text-zinc-700">Inzerát už není aktivní.</p>
            )}
          </div>
        </aside>
      </div>

      <section id="popis" className="mt-8 rounded-lg border border-line bg-white p-5 shadow-soft lg:hidden">
        <h2 className="text-xl font-bold text-ink">Popis</h2>
        <p className="mt-3 whitespace-pre-line break-words text-base leading-7 text-zinc-700">{listing.description}</p>
      </section>
    </div>
  );
}

function InfoRow({ label, value, emphasize = false, icon }: { label: string; value: string; emphasize?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 py-1.5 text-[15px]">
      <span className="text-zinc-600">{label}</span>
      <span className={clsx("min-w-0 break-words font-semibold", emphasize ? "text-moss" : "text-ink")}>
        <span className="inline-flex min-w-0 items-center gap-1">
          {icon}
          {value}
        </span>
      </span>
    </div>
  );
}
