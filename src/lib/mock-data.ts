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
  category: string;
  subcategory: string;
  title: string;
  description: string;
  price: number;
  condition: ListingCondition;
}> = [
  {
    category: "Komponenty",
    subcategory: "Vidlice",
    title: "Fox 36 Performance 160 mm 29 Boost",
    description: "Vzduchová trail/enduro vidlice, osa 15x110 Boost, sloupek 185 mm, po základním servisu.",
    price: 11500,
    condition: "good"
  },
  {
    category: "Komponenty",
    subcategory: "Přehazovačky",
    title: "Shimano XT RD-M8100 12s",
    description: "Přehazovačka pro 12rychlostní Shimano, rovné ramínko, kladky bez vůle.",
    price: 2490,
    condition: "good"
  },
  {
    category: "Komponenty",
    subcategory: "Brzdy, páky",
    title: "Shimano XT M8120 kompletní brzdy",
    description: "Čtyřpístkové brzdy, hadice 850/1600 mm, odvzdušněno před prodejem.",
    price: 3990,
    condition: "good"
  },
  {
    category: "Komponenty",
    subcategory: "Zapletená kola",
    title: "DT Swiss XM 1700 Spline 29 Boost",
    description: "Zapletená kola na Micro Spline, rovná, pásky pro bezduše jsou nalepené.",
    price: 9900,
    condition: "like_new"
  },
  {
    category: "Doplňky a příslušenství",
    subcategory: "Helmy",
    title: "POC Kortal Race MIPS velikost M",
    description: "Trailová helma bez pádu, čistá výstelka, součástí originální krabice.",
    price: 2490,
    condition: "good"
  },
  {
    category: "Doplňky a příslušenství",
    subcategory: "Odrazky a světla",
    title: "Garmin Varia RTL515",
    description: "Zadní radar se světlem, držák na sedlovku a USB kabel v balení.",
    price: 3290,
    condition: "like_new"
  },
  {
    category: "Oblečení a obuv",
    subcategory: "Tretry a obuv",
    title: "Shimano XC7 tretry velikost 43",
    description: "Karbonová podrážka, SPD kufry součástí, běžné známky používání.",
    price: 2190,
    condition: "good"
  },
  {
    category: "Oblečení a obuv",
    subcategory: "Bundy",
    title: "Endura MT500 nepromokavá bunda L",
    description: "Lehká bunda do deště s větráním, bez děr a poškozených zipů.",
    price: 2790,
    condition: "good"
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
    category: input.category,
    subcategory: input.subcategory,
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
