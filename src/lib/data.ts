import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
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

function single<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
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

  return { user, profile: profile as Profile | null };
}

export async function getListings(): Promise<ListingWithDetails[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return demoListings;
  }

  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return demoListings;
  }

  return data.map((item) => normalizeListing(item as RawListing));
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
    profile: profile as Profile | null,
    listings: (listings ?? []).map((item) => normalizeListing(item as RawListing))
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

  return data as Profile | null;
}
