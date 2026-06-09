import { Bike, Bolt, Grid2X2 } from "lucide-react";

export type ListingCategoryName = "Komponenty" | "Kola" | "Elektrokola";

export type CatalogSubcategory = {
  slug: string;
  label: string;
};

export type CatalogCategory = {
  slug: string;
  label: ListingCategoryName;
  icon: typeof Grid2X2;
  subcategories: CatalogSubcategory[];
};

export const catalogCategories: CatalogCategory[] = [
  {
    slug: "komponenty",
    label: "Komponenty",
    icon: Grid2X2,
    subcategories: [
      { slug: "odpruzeni", label: "Odpružení" },
      { slug: "pohon", label: "Pohon" },
      { slug: "brzdy", label: "Brzdy" },
      { slug: "kola-a-plaste", label: "Kola a pláště" },
      { slug: "kokpit", label: "Kokpit" },
      { slug: "sedlova-cast", label: "Sedlová část" },
      { slug: "pedaly", label: "Pedály" },
      { slug: "elektrokola-komponenty", label: "Elektrokola komponenty" },
      { slug: "ostatni-komponenty", label: "Ostatní" }
    ]
  },
  {
    slug: "kola",
    label: "Kola",
    icon: Bike,
    subcategories: [
      { slug: "mtb", label: "MTB" },
      { slug: "enduro", label: "Enduro" },
      { slug: "trail", label: "Trail" },
      { slug: "xc", label: "XC" },
      { slug: "downhill", label: "Downhill" },
      { slug: "gravel", label: "Gravel" },
      { slug: "silnicni", label: "Silniční" },
      { slug: "mestska", label: "Městská" },
      { slug: "detska", label: "Dětská" },
      { slug: "ostatni-kola", label: "Ostatní" }
    ]
  },
  {
    slug: "elektrokola",
    label: "Elektrokola",
    icon: Bolt,
    subcategories: [
      { slug: "mtb-e-bike", label: "MTB e-bike" },
      { slug: "trail-e-bike", label: "Trail e-bike" },
      { slug: "enduro-e-bike", label: "Enduro e-bike" },
      { slug: "xc-e-bike", label: "XC e-bike" },
      { slug: "gravel-e-bike", label: "Gravel e-bike" },
      { slug: "mestske-e-bike", label: "Městské e-bike" },
      { slug: "detske-e-bike", label: "Dětské e-bike" },
      { slug: "ostatni-elektrokola", label: "Ostatní" }
    ]
  }
];

export const defaultCatalogCategory = catalogCategories[0];

export function getCategoryByValue(value: string) {
  return catalogCategories.find((category) => category.label === value || category.slug === value) ?? null;
}

export function getSubcategoryByValue(categoryValue: string, subcategoryValue: string) {
  const category = getCategoryByValue(categoryValue);

  if (!category) {
    return null;
  }

  return category.subcategories.find((subcategory) => subcategory.label === subcategoryValue || subcategory.slug === subcategoryValue) ?? null;
}

export function isValidListingCategory(categoryValue: string, subcategoryValue: string) {
  const category = getCategoryByValue(categoryValue);

  if (!category) {
    return false;
  }

  return category.subcategories.some((subcategory) => subcategory.label === subcategoryValue);
}

export function findCatalogLabel(value: string) {
  const category = getCategoryByValue(value);

  if (category) {
    return category.label;
  }

  for (const item of catalogCategories) {
    const subcategory = getSubcategoryByValue(item.label, value);
    if (subcategory) {
      return subcategory.label;
    }
  }

  return null;
}

export function categoryHref(category?: string, subcategory?: string) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (subcategory) {
    params.set("subcategory", subcategory);
  }

  const query = params.toString();
  return query ? `/inzeraty?${query}` : "/inzeraty";
}
