import type { ListingWithDetails, Profile } from "@/lib/types";

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
  }
];

const [martin, tereza] = demoProfiles;

export const demoListings: ListingWithDetails[] = [
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    seller_id: martin.id,
    title: "Vidlice Fox 36 Factory",
    description:
      "Vzduchová vidlice po servisu, osa 15x110 Boost, zdvih 160 mm. Běžné kosmetické stopy, nohy bez škrábanců.",
    price: 16900,
    category: "Komponenty",
    condition: "good",
    location: "Liberec",
    status: "active",
    created_at: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
    updated_at: now.toISOString(),
    seller: martin,
    images: [
      {
        id: "img-1",
        listing_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
        image_url:
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=85",
        sort_order: 0,
        created_at: now.toISOString()
      }
    ]
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
    seller_id: tereza.id,
    title: "Tlumič RockShox Super Deluxe",
    description:
      "Rozměr 230x65 mm, sundaný z endura po přechodu na pružinu. Bez vůlí, funkční lockout.",
    price: 6400,
    category: "Komponenty",
    condition: "good",
    location: "Brno",
    status: "active",
    created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: now.toISOString(),
    seller: tereza,
    images: [
      {
        id: "img-2",
        listing_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
        image_url:
          "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=85",
        sort_order: 0,
        created_at: now.toISOString()
      }
    ]
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3",
    seller_id: martin.id,
    title: "Brzdy Shimano XT",
    description:
      "Přední a zadní brzda včetně kotoučů 180/203 mm. Desky ještě přibližně 70 %, odvzdušněno před měsícem.",
    price: 5200,
    category: "Komponenty",
    condition: "used",
    location: "Jablonec nad Nisou",
    status: "active",
    created_at: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: now.toISOString(),
    seller: martin,
    images: [
      {
        id: "img-3",
        listing_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3",
        image_url:
          "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=85",
        sort_order: 0,
        created_at: now.toISOString()
      }
    ]
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4",
    seller_id: tereza.id,
    title: "Zapletená kola DT Swiss",
    description:
      "Trailová kola 29\", náboje 350, ráfky XM 481, ořech Shimano Micro Spline. Rovná, bez větších ran.",
    price: 11900,
    category: "Komponenty",
    condition: "like_new",
    location: "Brno",
    status: "active",
    created_at: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: now.toISOString(),
    seller: tereza,
    images: [
      {
        id: "img-4",
        listing_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4",
        image_url:
          "https://images.unsplash.com/photo-1506316940527-4d1c138978a0?auto=format&fit=crop&w=1200&q=85",
        sort_order: 0,
        created_at: now.toISOString()
      }
    ]
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5",
    seller_id: martin.id,
    title: "Sedlovka OneUp Dropper",
    description: "Průměr 31.6 mm, zdvih 180 mm. Chod plynulý, včetně páčky a bowdenu.",
    price: 3900,
    category: "Komponenty",
    condition: "good",
    location: "Liberec",
    status: "active",
    created_at: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: now.toISOString(),
    seller: martin,
    images: [
      {
        id: "img-5",
        listing_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5",
        image_url:
          "https://images.unsplash.com/photo-1525107537758-84a35d0a96f4?auto=format&fit=crop&w=1200&q=85",
        sort_order: 0,
        created_at: now.toISOString()
      }
    ]
  }
];
