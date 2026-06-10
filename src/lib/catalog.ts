export type ListingCategoryName = "Doplňky a příslušenství" | "Komponenty" | "Oblečení a obuv";
export type CatalogIconName = "accessories" | "components" | "clothing";

export type CatalogSubcategory = {
  slug: string;
  label: string;
};

export type CatalogCategory = {
  slug: string;
  label: ListingCategoryName;
  icon: CatalogIconName;
  subcategories: CatalogSubcategory[];
};

export const catalogCategories: CatalogCategory[] = [
  {
    slug: "komponenty",
    label: "Komponenty",
    icon: "components",
    subcategories: [
      { slug: "zapletena-kola", label: "Zapletená kola" },
      { slug: "kliky-a-prevodniky", label: "Kliky a převodníky" },
      { slug: "sedla", label: "Sedla" },
      { slug: "vidlice", label: "Vidlice" },
      { slug: "plaste-duse-galusky", label: "Pláště, duše, galusky" },
      { slug: "brzdy-paky", label: "Brzdy, páky" },
      { slug: "rafky-vyplety", label: "Ráfky, výplety" },
      { slug: "riditka-rohy", label: "Řídítka, rohy" },
      { slug: "ramy", label: "Rámy" },
      { slug: "sedlovky", label: "Sedlovky" },
      { slug: "tlumice", label: "Tlumiče" },
      { slug: "kazety-a-retezy", label: "Kazety a řetězy" },
      { slug: "predstavce", label: "Představce" },
      { slug: "sady", label: "Sady" },
      { slug: "naboje-a-osy", label: "Náboje a osy" },
      { slug: "pedaly", label: "Pedály" },
      { slug: "prehazovacky", label: "Přehazovačky" },
      { slug: "ostatni-komponenty", label: "Ostatní komponenty" },
      { slug: "razeni", label: "Řazení" },
      { slug: "komponenty-na-elektrokola", label: "Komponenty na elektrokola" },
      { slug: "merice-vykonu-wattmetry", label: "Měřiče výkonu (wattmetry)" },
      { slug: "gripy-a-omotavky", label: "Gripy a omotávky" },
      { slug: "stredova-slozeni", label: "Středová složení" },
      { slug: "presmykace", label: "Přesmykače" },
      { slug: "hlavova-slozeni", label: "Hlavová složení" },
      { slug: "bowdeny-lanka", label: "Bowdeny, lanka" }
    ]
  },
  {
    slug: "doplnky-a-prislusenstvi",
    label: "Doplňky a příslušenství",
    icon: "accessories",
    subcategories: [
      { slug: "helmy", label: "Helmy" },
      { slug: "detske-sedacky-a-voziky", label: "Dětské sedačky a vozíky" },
      { slug: "cyklocomputery-a-gps", label: "Cyklocomputery a GPS" },
      { slug: "bryle", label: "Brýle" },
      { slug: "ostatni-prislusenstvi", label: "Ostatní příslušenství" },
      { slug: "chranice-a-pateraky", label: "Chrániče a páteřáky" },
      { slug: "brasny-a-tasky", label: "Brašny a tašky" },
      { slug: "nosice-a-zahradky-kol", label: "Nosiče a zahrádky kol" },
      { slug: "cyklonaradi-a-montazni-sady", label: "Cyklonářadí a montážní sady" },
      { slug: "nosice-na-kolo", label: "Nosiče na kolo" },
      { slug: "pumpy", label: "Pumpy" },
      { slug: "kosiky-a-lahve", label: "Košíky a lahve" },
      { slug: "odrazky-a-svetla", label: "Odrazky a světla" },
      { slug: "batohy-a-ledvinky", label: "Batohy a ledvinky" },
      { slug: "obaly-na-kola", label: "Obaly na kola" },
      { slug: "prislusenstvi-k-elektrokolum", label: "Příslušenství k elektrokolům" },
      { slug: "blatniky-kryty", label: "Blatníky, kryty" },
      { slug: "darky-pro-cyklisty", label: "Dárky pro cyklisty" },
      { slug: "vyziva", label: "Výživa" },
      { slug: "zamky", label: "Zámky" },
      { slug: "polepy-a-ochranne-folie", label: "Polepy a ochranné fólie" }
    ]
  },
  {
    slug: "obleceni-a-obuv",
    label: "Oblečení a obuv",
    icon: "clothing",
    subcategories: [
      { slug: "tretry-a-obuv", label: "Tretry a obuv" },
      { slug: "dresy", label: "Dresy" },
      { slug: "kalhoty-kratasy-a-sukne", label: "Kalhoty, kraťasy a sukně" },
      { slug: "bundy", label: "Bundy" },
      { slug: "rukavice", label: "Rukavice" },
      { slug: "vesty", label: "Vesty" },
      { slug: "navleky", label: "Návleky" },
      { slug: "funkcni-pradlo", label: "Funkční prádlo" },
      { slug: "cepice-a-celenky", label: "Čepice a čelenky" },
      { slug: "plastenky-na-kola", label: "Pláštěnky na kola" }
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
