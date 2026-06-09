import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { CategoryFields } from "@/components/CategoryFields";
import { SubmitButton } from "@/components/SubmitButton";
import { updateListingAction } from "@/app/actions";
import { conditionLabels } from "@/lib/format";
import { getCurrentUserProfile, getListingById } from "@/lib/data";
import type { ListingStatus } from "@/lib/types";

const statusLabels: Record<ListingStatus, string> = {
  active: "Aktivní",
  reserved: "Rezervováno",
  sold: "Prodáno",
  hidden: "Skryto"
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ chyba?: string }>;
};

export default async function EditListingPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { chyba } = await searchParams;
  const { user } = await getCurrentUserProfile();

  if (!user) {
    redirect(`/prihlaseni?next=/moje-inzeraty/${id}/upravit`);
  }

  const listing = await getListingById(id);

  if (!listing || listing.seller_id !== user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 sm:px-5 md:px-6 md:py-10">
      <Link href="/moje-inzeraty" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-ink">
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        Zpět na moje inzeráty
      </Link>

      <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-moss">Úprava inzerátu</p>
      <h1 className="mt-1 break-words text-2xl font-black text-ink sm:text-3xl">{listing.title}</h1>

      {chyba ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div> : null}

      <form action={updateListingAction} className="mt-5 space-y-5 rounded-lg border border-line bg-white p-4 shadow-soft sm:p-5">
        <input type="hidden" name="listing_id" value={listing.id} />

        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="title">
            Název
          </label>
          <input id="title" name="title" required minLength={3} maxLength={120} defaultValue={listing.title} className="mt-2 px-3 py-3" />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="description">
            Popis
          </label>
          <textarea
            id="description"
            name="description"
            required
            minLength={10}
            rows={6}
            defaultValue={listing.description}
            className="mt-2 px-3 py-3"
          />
        </div>

        <CategoryFields defaultCategory={listing.category} defaultSubcategory={listing.subcategory} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="price">
              Cena v Kč
            </label>
            <input
              id="price"
              name="price"
              required
              inputMode="numeric"
              min={1}
              type="number"
              defaultValue={listing.price}
              className="mt-2 px-3 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="condition">
              Stav položky
            </label>
            <select id="condition" name="condition" required defaultValue={listing.condition} className="mt-2 px-3 py-3">
              {Object.entries(conditionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="location">
            Lokalita
          </label>
          <input
            id="location"
            name="location"
            required
            minLength={2}
            maxLength={120}
            defaultValue={listing.location}
            className="mt-2 px-3 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="status">
            Status
          </label>
          <select id="status" name="status" required defaultValue={listing.status} className="mt-2 px-3 py-3">
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <SubmitButton pendingText="Ukládám inzerát...">
          <span className="inline-flex items-center gap-2">
            <Save className="h-4 w-4" aria-hidden="true" />
            Uložit inzerát
          </span>
        </SubmitButton>
      </form>
    </div>
  );
}
