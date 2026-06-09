import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { findCatalogLabel } from "@/lib/catalog";
import { demoListings, demoProfiles } from "@/lib/mock-data";
import type {
  Conversation,
  ListingImage,
  ListingWithDetails,
  Message,
  Order,
  OrderWithDetails,
  Profile,
  Review
} from "@/lib/types";

const listingSelect = `
  id,
  seller_id,
  title,
  description,
  price,
  category,
  condition,
  location,
  status,
  created_at,
  updated_at,
  listing_images (
    id,
    listing_id,
    image_url,
    sort_order,
    created_at
  ),
  seller:profiles!listings_seller_id_fkey (
    id,
    display_name,
    city,
    avatar_url,
    rating_average,
    rating_count,
    created_at,
    updated_at
  )
`;

const orderSelect = `
  id,
  listing_id,
  buyer_id,
  seller_id,
  status,
  created_at,
  updated_at,
  listing:listings!orders_listing_id_fkey (
    id,
    seller_id,
    title,
    description,
    price,
    category,
    condition,
    location,
    status,
    created_at,
    updated_at,
    listing_images (
      id,
      listing_id,
      image_url,
      sort_order,
      created_at
    )
  ),
  buyer:profiles!orders_buyer_id_fkey (
    id,
    display_name,
    city,
    avatar_url,
    rating_average,
    rating_count,
    created_at,
    updated_at
  ),
  seller:profiles!orders_seller_id_fkey (
    id,
    display_name,
    city,
    avatar_url,
    rating_average,
    rating_count,
    created_at,
    updated_at
  ),
  reviews (
    id,
    order_id,
    reviewer_id,
    reviewed_user_id,
    rating,
    text,
    created_at
  )
`;

type RawListing = Record<string, unknown> & {
  listing_images?: ListingImage[] | null;
  seller?: Profile | Profile[] | null;
};

type RawOrder = Record<string, unknown> & {
  listing?:
    | (Record<string, unknown> & { listing_images?: ListingImage[] | null })
    | (Record<string, unknown> & { listing_images?: ListingImage[] | null })[]
    | null;
  buyer?: Profile | Profile[] | null;
  seller?: Profile | Profile[] | null;
  reviews?: Review[] | null;
};

function normalizeSearchTerm(query?: string) {
  const value = query?.trim() ?? "";

  if (!value) {
    return "";
  }

  return value.replace(/[%_,]/g, " ").replace(/\s+/g, " ").slice(0, 80);
}

function normalizeCategoryTerm(category?: string) {
  const value = category?.trim() ?? "";

  if (!value) {
    return "";
  }

  return value.replace(/[%_,]/g, " ").replace(/\s+/g, " ").slice(0, 80);
}

function single<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function filterDemoListings(search: string, categoryLabel: string) {
  const lowerSearch = search.toLowerCase();
  const lowerCategory = categoryLabel.toLowerCase();

  return demoListings.filter((listing) => {
    const matchesSearch =
      !lowerSearch ||
      [listing.title, listing.description, listing.location, listing.category, conditionLabelsFallback(listing.condition)]
        .join(" ")
        .toLowerCase()
        .includes(lowerSearch);
    const matchesCategory = !lowerCategory || listing.category.toLowerCase().includes(lowerCategory);

    return matchesSearch && matchesCategory;
  });
}

function normalizeListing(raw: RawListing): ListingWithDetails {
  const seller = single(raw.seller) ?? demoProfiles[0];
  const images = [...(raw.listing_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return {
    id: String(raw.id),
    seller_id: String(raw.seller_id),
    title: String(raw.title),
    description: String(raw.description),
    price: Number(raw.price),
    category: String(raw.category),
    condition: raw.condition as ListingWithDetails["condition"],
    location: String(raw.location),
    status: raw.status as ListingWithDetails["status"],
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
    images,
    seller
  };
}

function normalizeOrder(raw: RawOrder): OrderWithDetails {
  const buyer = single(raw.buyer) ?? demoProfiles[0];
  const seller = single(raw.seller) ?? demoProfiles[1];
  const listingRaw = (single(raw.listing) ?? {}) as Record<string, unknown> & {
    listing_images?: ListingImage[] | null;
  };
  const listing = normalizeListing({
    ...listingRaw,
    seller,
    listing_images: listingRaw.listing_images ?? []
  });

  return {
    id: String(raw.id),
    listing_id: String(raw.listing_id),
    buyer_id: String(raw.buyer_id),
    seller_id: String(raw.seller_id),
    status: raw.status as OrderWithDetails["status"],
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
    listing,
    buyer,
    seller,
    reviews: raw.reviews ?? []
  };
}

export async function getCurrentUserProfile() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { user: null, profile: null };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, city, avatar_url, rating_average, rating_count, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    return { user, profile: profile as Profile };
  }

  const metadata = user.user_metadata ?? {};
  const metadataName = typeof metadata.display_name === "string" ? metadata.display_name.trim() : "";
  const emailName = user.email?.split("@")[0]?.trim() ?? "";
  const displayName = metadataName.length >= 2 ? metadataName : emailName.length >= 2 ? emailName : "Nový uživatel";
  const city = typeof metadata.city === "string" ? metadata.city.trim() : "";

  const { data: createdProfile } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      display_name: displayName,
      city
    })
    .select("id, display_name, city, avatar_url, rating_average, rating_count, created_at, updated_at")
    .maybeSingle();

  return { user, profile: (createdProfile as Profile | null) ?? null };
}

export async function getListings(query?: string, category?: string): Promise<ListingWithDetails[]> {
  const search = normalizeSearchTerm(query);
  const categorySlug = normalizeCategoryTerm(category);
  const categoryLabel = categorySlug ? findCatalogLabel(categorySlug) ?? categorySlug : "";
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return filterDemoListings(search, categoryLabel);
  }

  let request = supabase
    .from("listings")
    .select(listingSelect)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (categoryLabel) {
    request = request.ilike("category", `%${categoryLabel}%`);
  }

  if (search) {
    const pattern = `%${search}%`;
    request = request.or(
      `title.ilike.${pattern},description.ilike.${pattern},location.ilike.${pattern},category.ilike.${pattern},condition.ilike.${pattern}`
    );
  }

  const { data, error } = await request;
  const matchingDemoListings = filterDemoListings(search, categoryLabel);

  if (error || !data) {
    return matchingDemoListings;
  }

  const databaseListings = data.map((item) => normalizeListing(item as RawListing));
  const databaseIds = new Set(databaseListings.map((listing) => listing.id));

  return [...databaseListings, ...matchingDemoListings.filter((listing) => !databaseIds.has(listing.id))];
}

function conditionLabelsFallback(condition: ListingWithDetails["condition"]) {
  const labels: Record<ListingWithDetails["condition"], string> = {
    new: "Nové",
    like_new: "Jako nové",
    good: "Dobrý",
    used: "Použité",
    for_parts: "Na díly"
  };

  return labels[condition];
}

export async function searchProfiles(query?: string): Promise<Profile[]> {
  const search = normalizeSearchTerm(query);
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    if (!search) {
      return demoProfiles;
    }

    const lowerSearch = search.toLowerCase();
    return demoProfiles.filter((profile) =>
      [profile.display_name, profile.city].join(" ").toLowerCase().includes(lowerSearch)
    );
  }

  let request = supabase
    .from("profiles")
    .select("id, display_name, city, avatar_url, rating_average, rating_count, created_at, updated_at")
    .order("display_name", { ascending: true })
    .limit(40);

  if (search) {
    const pattern = `%${search}%`;
    request = request.or(`display_name.ilike.${pattern},city.ilike.${pattern}`);
  }

  const { data, error } = await request;

  if (error || !data) {
    return [];
  }

  return data as Profile[];
}

export async function getListingById(id: string): Promise<ListingWithDetails | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return demoListings.find((listing) => listing.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return demoListings.find((listing) => listing.id === id) ?? null;
  }

  return normalizeListing(data as RawListing);
}

export async function getUserListings(userId: string): Promise<ListingWithDetails[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return demoListings.filter((listing) => listing.seller_id === userId);
  }

  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("seller_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((item) => normalizeListing(item as RawListing));
}

export async function getPublicProfile(userId: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const profile = demoProfiles.find((item) => item.id === userId) ?? null;
    return {
      profile,
      listings: demoListings.filter((listing) => listing.seller_id === userId && listing.status === "active")
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, city, avatar_url, rating_average, rating_count, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  const { data: listings } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("seller_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return {
    profile: (profile as Profile | null) ?? demoProfiles.find((item) => item.id === userId) ?? null,
    listings: [
      ...(listings ?? []).map((item) => normalizeListing(item as RawListing)),
      ...demoListings.filter((listing) => listing.seller_id === userId && listing.status === "active")
    ]
  };
}

export async function getOrdersForUser(userId: string): Promise<OrderWithDetails[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((item) => normalizeOrder(item as unknown as RawOrder));
}

export async function getOrderById(orderId: string): Promise<OrderWithDetails | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeOrder(data as unknown as RawOrder);
}

export async function getConversation(listingId: string): Promise<Conversation | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const listing = await getListingById(listingId);

  if (!listing) {
    return null;
  }

  const { data: orderData } = await supabase
    .from("orders")
    .select("id, listing_id, buyer_id, seller_id, status, created_at, updated_at")
    .eq("listing_id", listingId)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const order = (orderData as Order | null) ?? null;

  if (listing.seller_id !== user.id && !order) {
    return null;
  }

  const receiverId = listing.seller_id === user.id ? order?.buyer_id : listing.seller_id;
  const receiver = receiverId
    ? await getProfileById(receiverId)
    : null;

  const { data: messages } = await supabase
    .from("messages")
    .select("id, listing_id, sender_id, receiver_id, text, is_read, created_at")
    .eq("listing_id", listingId)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: true });

  return {
    listing,
    order,
    receiver,
    messages: (messages as Message[] | null) ?? []
  };
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return demoProfiles.find((profile) => profile.id === id) ?? null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, city, avatar_url, rating_average, rating_count, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  return (data as Profile | null) ?? demoProfiles.find((profile) => profile.id === id) ?? null;
}
