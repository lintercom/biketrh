import { listingCategoryText } from "@/lib/catalog";
import type { ListingCondition, ListingWithDetails, Profile } from "@/lib/types";

const now = new Date("2026-06-08T10:00:00.000Z");

export const demoProfiles: Profile[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    display_name: "Martin Švec",
    city: "Liberec",
    avatar_url: null,
    rating_average: 4.8,
    rating_count: 12,
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    display_name: "Tereza Horáková",
    city: "Brno",
    avatar_url: null,
    rating_average: 4.6,
    rating_count: 8,
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    display_name: "Pavel Urban",
    city: "Praha",
    avatar_url: null,
    rating_average: 4.9,
    rating_count: 21,
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    display_name: "Klára Novotná",
    city: "Olomouc",
    avatar_url: null,
    rating_average: 4.7,
    rating_count: 15,
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  }
];

const imagePool = [
  "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1506316940527-4d1c138978a0?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1525107537758-84a35d0a96f4?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?auto=format&fit=crop&w=1200&q=85"
];

const locations = ["Brno", "Praha", "Olomouc", "Zlín", "Ostrava", "Liberec", "Plzeň", "Hradec Králové"];

const demoListingInputs: Array<{
  slug: string;
  title: string;
  description: string;
  price: number;
  condition: ListingCondition;
}> = [
  {
    slug: "vidlice",
    title: "Fox 36 Performance 160 mm 29 Boost",
    description: "Vzduchová trail/enduro vidlice, osa 15x110 Boost, sloupek 185 mm, po základním servisu.",
    price: 11500,
    condition: "good"
  },
  {
    slug: "tlumice",
    title: "RockShox Super Deluxe Select+ 230x65",
    description: "Zadní vzduchový tlumič s lockoutem, bez vůlí, sundaný po přechodu na pružinu.",
    price: 6400,
    condition: "good"
  },
  {
    slug: "pruziny",
    title: "Pružina Fox SLS 450 lb 2.80",
    description: "Lehká pružina pro DHX2 a podobné tlumiče, kosmetické stopy od montáže.",
    price: 1900,
    condition: "used"
  },
  {
    slug: "servisni-sady",
    title: "Servisní sada RockShox 35 Gold",
    description: "Originální těsnění, pěnové kroužky a olej pro malý servis vidlice.",
    price: 890,
    condition: "new"
  },
  {
    slug: "nahradni-dily-odpruzeni",
    title: "Tokeny Fox Float 36 sada",
    description: "Sada objemových tokenů pro doladění progresivity vzduchové komory.",
    price: 450,
    condition: "like_new"
  },
  {
    slug: "prehazovacky",
    title: "Shimano XT RD-M8100 12s",
    description: "Přehazovačka pro 12rychlostní Shimano, rovné ramínko, kladky bez vůle.",
    price: 2490,
    condition: "good"
  },
  {
    slug: "kazety",
    title: "SRAM GX Eagle kazeta 10-52",
    description: "Kazeta na XD ořech, najeto jednu sezonu, stále čisté řazení.",
    price: 2990,
    condition: "used"
  },
  {
    slug: "kliky",
    title: "SRAM GX Eagle DUB kliky 170 mm",
    description: "Kliky s převodníkem 32 zubů, osa DUB, běžné oděrky od bot.",
    price: 2890,
    condition: "good"
  },
  {
    slug: "razeni",
    title: "Shimano Deore M6100 řazení",
    description: "Řadicí páčka 12s včetně objímky, přesný chod, bez pádu.",
    price: 790,
    condition: "like_new"
  },
  {
    slug: "kotoucove-brzdy",
    title: "Shimano XT M8120 kompletní brzdy",
    description: "Čtyřpístkové brzdy, hadice 850/1600 mm, odvzdušněno před prodejem.",
    price: 3990,
    condition: "good"
  },
  {
    slug: "kotouce",
    title: "Magura MDR-P kotouče 203/180 mm",
    description: "Pár kotoučů pro náročnější jízdu, rovné, tloušťka ještě v limitu.",
    price: 1290,
    condition: "used"
  },
  {
    slug: "desticky",
    title: "Galfer Pro destičky Shimano 4p",
    description: "Nové sintrované destičky pro Shimano Saint, Zee a XT čtyřpístek.",
    price: 520,
    condition: "new"
  },
  {
    slug: "brzdove-hadice",
    title: "Jagwire Pro brzdová hadice 3000 mm",
    description: "Nerozbalená univerzální hadice s koncovkami pro hydraulické brzdy.",
    price: 690,
    condition: "new"
  },
  {
    slug: "zapletena-kola",
    title: "DT Swiss XM 1700 Spline 29 Boost",
    description: "Zapletená kola na Micro Spline, rovná, pásky pro bezduše jsou nalepené.",
    price: 9900,
    condition: "like_new"
  },
  {
    slug: "plaste",
    title: "Maxxis Minion DHF/DHR II 29x2.5",
    description: "Pár trailových plášťů, směs MaxxTerra, vzorek přibližně 80 %.",
    price: 1590,
    condition: "good"
  },
  {
    slug: "rafky",
    title: "Race Face ARC 30 ráfek 29",
    description: "Nový ráfek s vnitřní šířkou 30 mm, 32 děr, černé provedení.",
    price: 1790,
    condition: "new"
  },
  {
    slug: "naboje",
    title: "Hope Pro 4 zadní náboj 12x148",
    description: "Zadní náboj Boost, ořech XD, hlasitý záběr a hladký chod ložisek.",
    price: 2650,
    condition: "good"
  },
  {
    slug: "riditka",
    title: "Renthal Fatbar Carbon 800 mm",
    description: "Karbonová řídítka s rise 30 mm, zkrácená na 790 mm, bez prasklin.",
    price: 2490,
    condition: "good"
  },
  {
    slug: "predstavce",
    title: "OneUp Components představec 35 mm",
    description: "Krátký trailový představec pro průměr řídítek 35 mm.",
    price: 1190,
    condition: "like_new"
  },
  {
    slug: "gripy",
    title: "Ergon GE1 Evo Factory gripy",
    description: "Nové ergonomické gripy pro enduro a trail, oranžové zámky.",
    price: 620,
    condition: "new"
  },
  {
    slug: "hlavova-slozeni",
    title: "Cane Creek 40 hlavové složení",
    description: "Integrované hlavové složení včetně ložisek a víčka.",
    price: 950,
    condition: "new"
  },
  {
    slug: "sedla",
    title: "WTB Volt Medium sedlo",
    description: "Pohodlné trailové sedlo, ližiny rovné, boky bez natržení.",
    price: 790,
    condition: "good"
  },
  {
    slug: "teleskopicke-sedlovky",
    title: "OneUp Dropper V2 180 mm 31.6",
    description: "Teleskopická sedlovka včetně páčky a bowdenu, plynulý chod.",
    price: 3900,
    condition: "good"
  },
  {
    slug: "sedlovky",
    title: "Thomson Elite sedlovka 30.9",
    description: "Klasická pevná sedlovka, délka 410 mm, velmi zachovalý stav.",
    price: 1490,
    condition: "like_new"
  },
  {
    slug: "platformove-pedaly",
    title: "Chromag Dagga platformové pedály",
    description: "Velká platforma, kovové piny, ložiska bez vůle.",
    price: 1890,
    condition: "used"
  },
  {
    slug: "naslapne-pedaly",
    title: "Shimano XT PD-M8120 SPD",
    description: "Nášlapné trailové pedály s klecí, včetně kufrů.",
    price: 1690,
    condition: "good"
  },
  {
    slug: "servis-pedalu",
    title: "Servisní sada OneUp Aluminum Pedal",
    description: "Osy, ložiska a těsnění pro kompletní repas pedálů OneUp.",
    price: 750,
    condition: "new"
  },
  {
    slug: "baterie",
    title: "Bosch PowerTube 625 Wh",
    description: "Baterie pro elektrokolo, kapacita ověřená diagnostikou na 91 %.",
    price: 10900,
    condition: "good"
  },
  {
    slug: "motory",
    title: "Bosch Performance CX Gen4 motor",
    description: "Pohonná jednotka po diagnostice, vhodná jako náhradní díl.",
    price: 14900,
    condition: "used"
  },
  {
    slug: "displeje",
    title: "Bosch Kiox 300 displej",
    description: "Displej bez škrábanců, držák a kabeláž součástí balení.",
    price: 2490,
    condition: "like_new"
  },
  {
    slug: "trailova-kola",
    title: "Specialized Stumpjumper Comp Alloy M",
    description: "Trailové kolo 29, zdvih 140/130 mm, pravidelně servisované.",
    price: 52900,
    condition: "good"
  },
  {
    slug: "enduro-kola",
    title: "Trek Slash 8 Gen 5 velikost L",
    description: "Enduro kolo na 29 kolech, pružinový tlumič, nové brzdy.",
    price: 68900,
    condition: "used"
  },
  {
    slug: "xc-kola",
    title: "Canyon Exceed CF 7 velikost M",
    description: "Lehký karbonový hardtail, 1x12 Shimano, váha pod 11 kg.",
    price: 43900,
    condition: "like_new"
  },
  {
    slug: "naradi",
    title: "Park Tool momentový klíč TW-5.2",
    description: "Dílenský momentový klíč pro přesné dotažení komponentů.",
    price: 2890,
    condition: "good"
  },
  {
    slug: "maziva-a-cisteni",
    title: "Muc-Off čisticí a mazací sada",
    description: "Sada čističe, kartáčů a maziva na řetěz pro kompletní údržbu.",
    price: 690,
    condition: "new"
  },
  {
    slug: "loziska",
    title: "Enduro Bearings sada do rámu",
    description: "Ložiska pro přepákování celoodpruženého rámu, nerozbaleno.",
    price: 1190,
    condition: "new"
  },
  {
    slug: "helmy",
    title: "POC Kortal Race MIPS M",
    description: "Trailová helma s MIPS, bez pádu, drobné kosmetické stopy.",
    price: 2490,
    condition: "good"
  },
  {
    slug: "chranice",
    title: "Leatt AirFlex Pro chrániče kolen L",
    description: "Lehké chrániče na trail, prané, bez poškození.",
    price: 1290,
    condition: "good"
  },
  {
    slug: "tretry",
    title: "Five Ten Trailcross GTX 43",
    description: "Voděodolné platformové tretry, podrážka ve velmi dobrém stavu.",
    price: 2190,
    condition: "like_new"
  },
  {
    slug: "testovaci-mtb",
    title: "Giant Trance X testovací kus",
    description: "Testovací kolo z prodejny, plná záruka od ověřeného obchodu.",
    price: 79900,
    condition: "like_new"
  },
  {
    slug: "testovaci-komponenty",
    title: "SRAM Maven Silver testovací brzdy",
    description: "Krátce jetý testovací brzdový set, kompletní balení.",
    price: 6490,
    condition: "like_new"
  },
  {
    slug: "vykup-kol",
    title: "Protiúčet za trailové kolo",
    description: "Ověřený obchod nabízí protiúčet za trailová a enduro kola.",
    price: 1,
    condition: "good"
  },
  {
    slug: "protiucet-komponentu",
    title: "Protiúčet za prémiové komponenty",
    description: "Výkup vidlic, tlumičů a sad pohonu proti nové výbavě.",
    price: 1,
    condition: "good"
  },
  {
    slug: "servis-odpruzeni",
    title: "Servis vidlice a tlumiče do 48 hodin",
    description: "Ověřený servis odpružení, výměna těsnění, olejů a nastavení.",
    price: 2490,
    condition: "new"
  },
  {
    slug: "servis-pohonu",
    title: "Kompletní servis pohonu 1x12",
    description: "Seřízení řazení, kontrola kazety, řetězu a převodníku.",
    price: 990,
    condition: "new"
  },
  {
    slug: "bazarove-obchody",
    title: "Prověřený bazar komponentů",
    description: "Balík rozbalených a použitých komponentů s dokladem od obchodu.",
    price: 4990,
    condition: "good"
  },
  {
    slug: "rozbalene-zbozi",
    title: "Rozbalená sada Shimano SLX",
    description: "Rozbalené brzdy, řazení a přehazovačka z vystaveného kola.",
    price: 6990,
    condition: "like_new"
  }
];

export const demoListings: ListingWithDetails[] = demoListingInputs.map((input, index) => {
  const seller = demoProfiles[index % demoProfiles.length];
  const idSuffix = (index + 1).toString(16).padStart(12, "0");
  const id = `aaaaaaaa-aaaa-4aaa-8aaa-${idSuffix}`;

  return {
    id,
    seller_id: seller.id,
    title: input.title,
    description: input.description,
    price: input.price,
    category: listingCategoryText(input.slug),
    condition: input.condition,
    location: locations[index % locations.length],
    status: "active",
    created_at: new Date(now.getTime() - (index + 1) * 60 * 60 * 1000).toISOString(),
    updated_at: now.toISOString(),
    seller,
    images: [
      {
        id: `img-${index + 1}`,
        listing_id: id,
        image_url: imagePool[index % imagePool.length],
        sort_order: 0,
        created_at: now.toISOString()
      }
    ]
  };
});
