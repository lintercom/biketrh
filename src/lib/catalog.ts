import {
  Bike,
  CircleDot,
  Disc3,
  Gauge,
  Grid2X2,
  Hammer,
  Headphones,
  PackageCheck,
  RotateCw,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sofa,
  Sparkles,
  Store,
  Wrench,
  Zap
} from "lucide-react";

export type CatalogSubcategory = {
  slug: string;
  label: string;
  description: string;
};

export type CatalogCategory = {
  slug: string;
  label: string;
  description: string;
  icon: typeof Grid2X2;
  subcategories: CatalogSubcategory[];
};

export type CatalogSection = {
  slug: string;
  label: string;
  icon: typeof Grid2X2;
  categories: CatalogCategory[];
};

export const catalogSections: CatalogSection[] = [
  {
    slug: "komponenty",
    label: "Komponenty",
    icon: Grid2X2,
    categories: [
      {
        slug: "odpruzeni",
        label: "Odpružení",
        description: "Vidlice, tlumiče a vše pro hladkou jízdu v terénu.",
        icon: SlidersHorizontal,
        subcategories: [
          { slug: "vidlice", label: "Vidlice", description: "Vzduchové i pružinové vidlice pro trail, enduro a XC." },
          { slug: "tlumice", label: "Tlumiče", description: "Zadní tlumiče v běžných rozměrech a uchyceních." },
          { slug: "pruziny", label: "Pružiny", description: "Ocelové a lehké pružiny pro ladění odpružení." },
          { slug: "servisni-sady", label: "Servisní sady", description: "Těsnění, oleje, tokeny a servisní balíčky." },
          { slug: "nahradni-dily-odpruzeni", label: "Náhradní díly odpružení", description: "Drobné díly, páčky, osy a hardware." }
        ]
      },
      {
        slug: "pohon",
        label: "Pohon",
        description: "Řazení, kazety, kliky a díly pro efektivní přenos výkonu.",
        icon: Settings,
        subcategories: [
          { slug: "prehazovacky", label: "Přehazovačky", description: "Mechanické i elektronické měniče." },
          { slug: "kazety", label: "Kazety", description: "Kazety pro silnici, gravel, trail i enduro." },
          { slug: "kliky", label: "Kliky", description: "Kliky, převodníky a středová složení." },
          { slug: "razeni", label: "Řazení", description: "Řadicí páčky, gripshift a kabeláž." }
        ]
      },
      {
        slug: "brzdy",
        label: "Brzdy",
        description: "Kotoučové brzdy, kotouče, destičky a odvzdušnění.",
        icon: Disc3,
        subcategories: [
          { slug: "kotoucove-brzdy", label: "Kotoučové brzdy", description: "Sety brzd, třmeny a páky." },
          { slug: "kotouce", label: "Kotouče", description: "Brzdové kotouče různých průměrů." },
          { slug: "desticky", label: "Destičky", description: "Organické, sintrované i směsové destičky." },
          { slug: "brzdove-hadice", label: "Brzdové hadice", description: "Hadice, olivy, trny a servisní koncovky." }
        ]
      },
      {
        slug: "kola-a-plaste",
        label: "Kola a pláště",
        description: "Zapletená kola, ráfky, náboje, pláště a bezdušové díly.",
        icon: CircleDot,
        subcategories: [
          { slug: "zapletena-kola", label: "Zapletená kola", description: "Kompletní sety kol pro různé disciplíny." },
          { slug: "plaste", label: "Pláště", description: "MTB, gravel a silniční pláště." },
          { slug: "rafky", label: "Ráfky", description: "Samostatné ráfky a výplety." },
          { slug: "naboje", label: "Náboje", description: "Přední i zadní náboje v běžných standardech." }
        ]
      },
      {
        slug: "kokpit",
        label: "Kokpit",
        description: "Řídítka, představce, gripy a ovládací prvky.",
        icon: Headphones,
        subcategories: [
          { slug: "riditka", label: "Řídítka", description: "Trailová, enduro, gravel i silniční řídítka." },
          { slug: "predstavce", label: "Představce", description: "Představce různých délek a úhlů." },
          { slug: "gripy", label: "Gripy", description: "Gripy, omotávky a koncovky." },
          { slug: "hlavova-slozeni", label: "Hlavová složení", description: "Ložiska, misky a expanzní prvky." }
        ]
      },
      {
        slug: "sedlova-cast",
        label: "Sedlová část",
        description: "Sedla, teleskopické sedlovky, objímky a ovládání.",
        icon: Sofa,
        subcategories: [
          { slug: "sedla", label: "Sedla", description: "Sportovní, trailová a pohodlná sedla." },
          { slug: "teleskopicke-sedlovky", label: "Teleskopické sedlovky", description: "Sedlovky s vnitřním i vnějším vedením." },
          { slug: "sedlovky", label: "Sedlovky", description: "Pevné sedlovky a příslušenství." }
        ]
      },
      {
        slug: "pedaly",
        label: "Pedály",
        description: "Platformy, nášlapné pedály a servisní díly.",
        icon: RotateCw,
        subcategories: [
          { slug: "platformove-pedaly", label: "Platformové pedály", description: "Pedály s piny pro trail a enduro." },
          { slug: "naslapne-pedaly", label: "Nášlapné pedály", description: "SPD a další nášlapné systémy." },
          { slug: "servis-pedalu", label: "Servis pedálů", description: "Ložiska, osy, piny a servisní sady." }
        ]
      },
      {
        slug: "elektrokola",
        label: "Elektrokola",
        description: "Baterie, motory, displeje a e-bike komponenty.",
        icon: Zap,
        subcategories: [
          { slug: "baterie", label: "Baterie", description: "Baterie, nabíječky a držáky." },
          { slug: "motory", label: "Motory", description: "Pohonné jednotky a servisní díly." },
          { slug: "displeje", label: "Displeje", description: "Displeje, ovladače a kabeláž." }
        ]
      }
    ]
  },
  {
    slug: "kola",
    label: "Kola",
    icon: Bike,
    categories: [
      {
        slug: "horska-kola",
        label: "Horská kola",
        description: "Trail, enduro, XC a sjezdová kola.",
        icon: Bike,
        subcategories: [
          { slug: "trailova-kola", label: "Trailová kola", description: "Univerzální kola do terénu." },
          { slug: "enduro-kola", label: "Enduro kola", description: "Kola pro rychlou jízdu v těžším terénu." },
          { slug: "xc-kola", label: "XC kola", description: "Lehká kola na výkonnostní jízdu." }
        ]
      }
    ]
  },
  {
    slug: "servis-a-dily",
    label: "Servis a díly",
    icon: Wrench,
    categories: [
      {
        slug: "servis",
        label: "Servis",
        description: "Nářadí, maziva, servisní sady a drobné díly.",
        icon: Hammer,
        subcategories: [
          { slug: "naradi", label: "Nářadí", description: "Dílenské i cestovní nářadí." },
          { slug: "maziva-a-cisteni", label: "Maziva a čištění", description: "Maziva, čističe a údržba." },
          { slug: "loziska", label: "Ložiska", description: "Ložiska rámu, kol a středů." }
        ]
      }
    ]
  },
  {
    slug: "vybaveni",
    label: "Vybavení",
    icon: ShoppingBag,
    categories: [
      {
        slug: "vybaveni-jezdce",
        label: "Vybavení jezdce",
        description: "Helmy, chrániče, tretry, oblečení a doplňky.",
        icon: ShieldCheck,
        subcategories: [
          { slug: "helmy", label: "Helmy", description: "Silniční, MTB i integrální helmy." },
          { slug: "chranice", label: "Chrániče", description: "Kolena, lokty, páteřáky a rukavice." },
          { slug: "tretry", label: "Tretry", description: "MTB, gravel i silniční boty." }
        ]
      }
    ]
  },
  {
    slug: "testovacky",
    label: "Testovačky",
    icon: Sparkles,
    categories: [
      {
        slug: "testovaci-kola",
        label: "Testovací kola",
        description: "Krátkodobě jetá kola a komponenty z testování.",
        icon: Gauge,
        subcategories: [
          { slug: "testovaci-mtb", label: "Testovací MTB", description: "Horská kola z demo flotil." },
          { slug: "testovaci-komponenty", label: "Testovací komponenty", description: "Komponenty po krátkém testu." }
        ]
      }
    ]
  },
  {
    slug: "protiucty",
    label: "Protiúčty",
    icon: PackageCheck,
    categories: [
      {
        slug: "vykup-a-protiucet",
        label: "Výkup a protiúčet",
        description: "Nabídky obchodů a servisů s možností protiúčtu.",
        icon: PackageCheck,
        subcategories: [
          { slug: "vykup-kol", label: "Výkup kol", description: "Výkup celých kol." },
          { slug: "protiucet-komponentu", label: "Protiúčet komponentů", description: "Komponenty jako část platby." }
        ]
      }
    ]
  },
  {
    slug: "overene-servisy",
    label: "Ověřené servisy",
    icon: ShieldCheck,
    categories: [
      {
        slug: "servisni-mista",
        label: "Servisní místa",
        description: "Prověření mechanici a servisní nabídky.",
        icon: Wrench,
        subcategories: [
          { slug: "servis-odpruzeni", label: "Servis odpružení", description: "Servis vidlic a tlumičů." },
          { slug: "servis-pohonu", label: "Servis pohonu", description: "Seřízení a výměny pohonu." }
        ]
      }
    ]
  },
  {
    slug: "overene-obchody",
    label: "Ověřené obchody",
    icon: Store,
    categories: [
      {
        slug: "obchody",
        label: "Obchody",
        description: "Prověření prodejci bazarových i rozbalených dílů.",
        icon: Store,
        subcategories: [
          { slug: "bazarove-obchody", label: "Bazarové obchody", description: "Obchody s použitými komponenty." },
          { slug: "rozbalene-zbozi", label: "Rozbalené zboží", description: "Rozbalené a vystavené kusy." }
        ]
      }
    ]
  }
];

export const allCatalogCategories = catalogSections.flatMap((section) => section.categories);
export const allCatalogSubcategories = allCatalogCategories.flatMap((category) => category.subcategories);
export const defaultCatalogSection = catalogSections[0];
export const defaultCatalogCategory = defaultCatalogSection.categories[0];

export function findCatalogLabel(slug: string) {
  for (const section of catalogSections) {
    if (section.slug === slug) {
      return section.label;
    }

    for (const category of section.categories) {
      if (category.slug === slug) {
        return category.label;
      }

      const subcategory = category.subcategories.find((item) => item.slug === slug);
      if (subcategory) {
        return subcategory.label;
      }
    }
  }

  return null;
}

export function listingCategoryText(slug: string) {
  for (const section of catalogSections) {
    for (const category of section.categories) {
      const subcategory = category.subcategories.find((item) => item.slug === slug);
      if (subcategory) {
        return `${section.label} / ${category.label} / ${subcategory.label}`;
      }
    }
  }

  return findCatalogLabel(slug) ?? "Komponenty";
}

export function categoryHref(slug?: string) {
  return slug ? `/inzeraty?category=${encodeURIComponent(slug)}` : "/inzeraty";
}
