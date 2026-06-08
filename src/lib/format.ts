import type { ListingCondition, ListingStatus, OrderStatus, Profile } from "@/lib/types";

export const conditionLabels: Record<ListingCondition, string> = {
  new: "Nové",
  like_new: "Jako nové",
  good: "Dobrý stav",
  used: "Používané",
  for_parts: "Na díly"
};

export const listingStatusLabels: Record<ListingStatus, string> = {
  active: "Aktivní",
  reserved: "Rezervováno",
  sold: "Prodáno",
  hidden: "Skryto"
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  created: "Čeká na potvrzení",
  accepted: "Přijato",
  cancelled: "Zrušeno",
  completed: "Dokončeno"
};

export function formatPrice(price: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(price);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatRating(profile: Pick<Profile, "rating_average" | "rating_count">) {
  if (!profile.rating_count) {
    return "Bez hodnocení";
  }

  return `${Number(profile.rating_average).toFixed(1)} (${profile.rating_count})`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("cs-CZ"))
    .join("");
}
