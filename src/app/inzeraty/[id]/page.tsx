import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { SubmitButton } from "@/components/SubmitButton";
import { ListingStatusBadge } from "@/components/StatusBadge";
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
  const mainImage = listing.images[0]?.image_url;

  return (
    <div className="mx-auto max-w-6xl px-5 py-5 md:px-6 md:py-10">
      <Link href="/inzeraty" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Zpět na inzeráty
      </Link>

      {chyba ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div>
      ) : null}

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <section className="space-y-3">
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white">
            {mainImage ? (
              <img src={mainImage} alt={listing.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">Bez fotografie</div>
            )}
          </div>
          {listing.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-2">
              {listing.images.slice(1, 5).map((image) => (
                <img
                  key={image.id}
                  src={image.image_url}
                  alt={listing.title}
                  className="aspect-square rounded-lg object-cover"
                />
              ))}
            </div>
          ) : null}
        </section>

        <aside className="space-y-5">
          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <ListingStatusBadge status={listing.status} />
                <h1 className="mt-3 text-3xl font-black leading-tight text-ink">{listing.title}</h1>
                <p className="mt-2 text-3xl font-black text-ink">{formatPrice(listing.price)}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-fog p-3">
                <p className="text-zinc-500">Stav</p>
                <p className="mt-1 font-semibold text-ink">{conditionLabels[listing.condition]}</p>
              </div>
              <div className="rounded-lg bg-fog p-3">
                <p className="text-zinc-500">Kategorie</p>
                <p className="mt-1 font-semibold text-ink">{listing.category}</p>
              </div>
              <div className="rounded-lg bg-fog p-3">
                <p className="text-zinc-500">Lokalita</p>
                <p className="mt-1 inline-flex items-center gap-1 font-semibold text-ink">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {listing.location}
                </p>
              </div>
              <div className="rounded-lg bg-fog p-3">
                <p className="text-zinc-500">Vloženo</p>
                <p className="mt-1 font-semibold text-ink">{formatDate(listing.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-lg font-bold text-ink">Popis</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-700">{listing.description}</p>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <Link href={`/uzivatel/${listing.seller.id}`} className="flex items-center gap-3">
              <Avatar profile={listing.seller} size="lg" />
              <div className="min-w-0">
                <p className="font-bold text-ink">{listing.seller.display_name}</p>
                <p className="text-sm text-zinc-600">{listing.seller.city}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-zinc-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {formatRating(listing.seller)}
                </p>
              </div>
            </Link>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-fog p-3 text-sm text-zinc-700">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
              Hodnocení se přidává až po dokončeném obchodu.
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            {!user ? (
              <Link
                href={`/prihlaseni?next=/inzeraty/${listing.id}`}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white hover:bg-ink"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Mám zájem
              </Link>
            ) : isOwner ? (
              <p className="rounded-lg bg-fog p-4 text-sm text-zinc-700">Toto je váš inzerát.</p>
            ) : canOrder ? (
              <form action={startOrderAction} className="space-y-3">
                <input type="hidden" name="listing_id" value={listing.id} />
                <label className="block text-sm font-semibold text-ink" htmlFor="message">
                  Zpráva pro prodejce
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  defaultValue="Dobrý den, mám zájem o tento komponent."
                  className="px-3 py-3 text-sm"
                />
                <SubmitButton pendingText="Vytvářím rezervaci...">
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Mám zájem
                  </span>
                </SubmitButton>
              </form>
            ) : (
              <p className="rounded-lg bg-fog p-4 text-sm text-zinc-700">Inzerát už není aktivní.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
