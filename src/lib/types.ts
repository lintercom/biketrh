export type ListingCondition = "new" | "like_new" | "good" | "used" | "for_parts";
export type ListingStatus = "active" | "reserved" | "sold" | "hidden";
export type OrderStatus = "created" | "accepted" | "cancelled" | "completed";

export type Profile = {
  id: string;
  display_name: string;
  city: string;
  avatar_url: string | null;
  rating_average: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
};

export type ListingImage = {
  id: string;
  listing_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type Listing = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  condition: ListingCondition;
  location: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
};

export type ListingWithDetails = Listing & {
  images: ListingImage[];
  seller: Profile;
};

export type Order = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  text: string | null;
  created_at: string;
};

export type OrderWithDetails = Order & {
  listing: ListingWithDetails;
  buyer: Profile;
  seller: Profile;
  reviews: Review[];
};

export type Message = {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  is_read: boolean;
  created_at: string;
};

export type Conversation = {
  listing: ListingWithDetails;
  order: Order | null;
  receiver: Profile | null;
  messages: Message[];
};
