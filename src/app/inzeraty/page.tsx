import { SlidersHorizontal } from "lucide-react";
import { ConfigNotice } from "@/components/ConfigNotice";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/ListingCard";
import { findCatalogLabel } from "@/lib/catalog";
import { getListings } from "@/lib/data";

type PageProps = {
  searchParams: Promise<{ q?: string; category?: string; subcategory?: string }>;
};

export default async function ListingsPage({ searchParams }: PageProps) {
  const { q = "", category = "", subcategory = "" } = await searchParams;
  const query = q.trim();
  const categorySlug = category.trim();
  const subcategorySlug = subcategory.trim();
  const categoryLabel = categorySlug ? findCatalogLabel(categorySlug) ?? categorySlug : "";
  const subcategoryLabel = subcategorySlug ? findCatalogLabel(subcategorySlug) ?? subcategorySlug : "";
  const listings = await getListings(query, categorySlug, subcategorySlug);

  const title = query
    ? `Výsledky pro „${query}“`
    : subcategoryLabel
      ? subcategoryLabel
      : categoryLabel
        ? categoryLabel
        : "Inzeráty";

  const activeFilterLabel = subcategoryLabel
    ? `${categoryLabel || "Kategorie"} / ${subcategoryLabel}`
    : categoryLabel;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 md:px-8 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-base font-semibold uppercase tracking-wide text-moss">
            {activeFilterLabel ? "Kategorie" : "BikeTrh"}
          </p>
          <h1 className="mt-1 break-words text-3xl font-black text-ink sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            {query
              ? "Hledáme v názvech, popisech, rozměrech, lokalitách, kategoriích a dalších údajích aktivních inzerátů."
              : activeFilterLabel
                ? `Aktivní nabídky zařazené do kategorie ${activeFilterLabel}.`
                : "Nejnovější nabídky cyklo vybavení od lidí z bike komunity."}
          </p>
        </div>
        <div className="inline-flex min-h-12 w-fit items-center gap-2 rounded-lg border border-line bg-white px-4 py-3 text-base font-semibold text-zinc-700">
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          Nejnovější první
        </div>
      </div>

      <div className="mt-5">
        <ConfigNotice />
      </div>

      {listings.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title={query || activeFilterLabel ? "Žádné inzeráty nenalezeny" : "Zatím tu nejsou žádné inzeráty"}
            text={
              query || activeFilterLabel
                ? "Zkuste jiné slovo, obecnější výraz nebo širší kategorii."
                : "Jakmile někdo přidá inzerát, zobrazí se tady."
            }
            href="/pridat-inzerat"
            action="Přidat inzerát"
          />
        </div>
      )}
    </div>
  );
}
