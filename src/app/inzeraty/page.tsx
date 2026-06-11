import { ConfigNotice } from "@/components/ConfigNotice";
import { EmptyState } from "@/components/EmptyState";
import { ListingFilters } from "@/components/ListingFilters";
import { ListingCard } from "@/components/ListingCard";
import { findCatalogLabel } from "@/lib/catalog";
import { getListings, type ListingSort } from "@/lib/data";

type PageProps = {
  searchParams: Promise<{ q?: string; category?: string; subcategory?: string; sort?: string; condition?: string; minPrice?: string; maxPrice?: string }>;
};

export default async function ListingsPage({ searchParams }: PageProps) {
  const { q = "", category = "", subcategory = "", sort = "newest", condition = "", minPrice = "", maxPrice = "" } = await searchParams;
  const query = q.trim();
  const categorySlug = category.trim();
  const subcategorySlug = subcategory.trim();
  const sortValue: ListingSort = sort === "price_asc" || sort === "price_desc" ? sort : "newest";
  const minPriceValue = minPrice.trim() ? Number(minPrice) : null;
  const maxPriceValue = maxPrice.trim() ? Number(maxPrice) : null;
  const categoryLabel = categorySlug ? findCatalogLabel(categorySlug) ?? categorySlug : "";
  const subcategoryLabel = subcategorySlug ? findCatalogLabel(subcategorySlug) ?? subcategorySlug : "";
  const listings = await getListings(query, categorySlug, subcategorySlug, {
    sort: sortValue,
    condition: condition.trim(),
    minPrice: minPriceValue,
    maxPrice: maxPriceValue
  });

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
    <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-5 md:px-8 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="break-words text-3xl font-black text-ink sm:text-4xl">{title}</h1>
        </div>
      </div>

      <div className="mt-5">
        <ListingFilters
          query={query}
          category={categorySlug}
          subcategory={subcategorySlug}
          sort={sortValue}
          condition={condition.trim()}
          minPrice={minPrice.trim()}
          maxPrice={maxPrice.trim()}
        />
      </div>

      <div className="mt-5">
        <ConfigNotice />
      </div>

      {listings.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
