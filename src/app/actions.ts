"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isValidListingCategory } from "@/lib/catalog";
import type { ListingCondition, ListingStatus, OrderStatus } from "@/lib/types";

const listingConditions: ListingCondition[] = ["new", "like_new", "good", "used", "for_parts"];
const listingStatuses: ListingStatus[] = ["active", "reserved", "sold", "hidden"];
const orderStatuses: OrderStatus[] = ["created", "accepted", "cancelled", "completed"];

function textField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function safeRedirectPath(value: string, fallback = "/") {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return fallback;
}

function withError(path: string, message: string): never {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}chyba=${encodeURIComponent(message)}`);
}

async function requireSupabase(path: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase || !isSupabaseConfigured()) {
    withError(path, "Nejdřív doplňte Supabase URL a anon klíč do .env.");
  }

  return supabase;
}

async function requireUser(path: string) {
  const supabase = await requireSupabase(path);
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/prihlaseni?next=${encodeURIComponent(path)}`);
  }

  return { supabase, user };
}

export async function signInAction(formData: FormData) {
  const next = safeRedirectPath(textField(formData, "next"), "/profil");
  const supabase = await requireSupabase(`/prihlaseni?next=${encodeURIComponent(next)}`);
  const email = textField(formData, "email");
  const password = textField(formData, "password");

  if (!email || !password) {
    withError(`/prihlaseni?next=${encodeURIComponent(next)}`, "Vyplňte email a heslo.");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    withError(`/prihlaseni?next=${encodeURIComponent(next)}`, "Přihlášení se nepovedlo. Zkontrolujte email a heslo.");
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const supabase = await requireSupabase("/registrace");
  const email = textField(formData, "email");
  const password = textField(formData, "password");
  const displayName = textField(formData, "display_name");
  const city = textField(formData, "city");
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  if (!email || !password || !displayName || !city) {
    withError("/registrace", "Vyplňte email, heslo, zobrazované jméno a město.");
  }

  if (password.length < 6) {
    withError("/registrace", "Heslo musí mít alespoň 6 znaků.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        display_name: displayName,
        city
      }
    }
  });

  if (error) {
    withError("/registrace", "Registrace se nepovedla. Zkuste jiný email nebo silnější heslo.");
  }

  if (data.session && data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      display_name: displayName,
      city
    });

    revalidatePath("/", "layout");
    redirect("/profil");
  }

  redirect("/prihlaseni?zprava=Registrace je vytvořená. Pokud Supabase vyžaduje ověření, potvrďte email.");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfileAction(formData: FormData) {
  const { supabase, user } = await requireUser("/profil");
  const displayName = textField(formData, "display_name");
  const city = textField(formData, "city");

  if (!displayName || !city) {
    withError("/profil", "Vyplňte zobrazované jméno a město.");
  }

  const { error } = await supabase.from("profiles").upsert({ id: user.id, display_name: displayName, city });

  if (error) {
    withError("/profil", "Profil se nepovedlo uložit.");
  }

  revalidatePath("/", "layout");
  redirect("/profil?zprava=Profil je uložený.");
}

function normalizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80);
}

export async function createListingAction(formData: FormData) {
  const { supabase, user } = await requireUser("/pridat-inzerat");
  const title = textField(formData, "title");
  const description = textField(formData, "description");
  const category = textField(formData, "category");
  const subcategory = textField(formData, "subcategory");
  const location = textField(formData, "location");
  const condition = textField(formData, "condition") as ListingCondition;
  const price = Math.round(Number(textField(formData, "price").replace(/\s/g, "").replace(",", ".")));

  if (!isValidListingCategory(category, subcategory)) {
    withError("/pridat-inzerat", "Vyberte hlavní kategorii a odpovídající podkategorii.");
  }

  if (!title || !description || !location || Number.isNaN(price) || price <= 0 || !listingConditions.includes(condition)) {
    withError("/pridat-inzerat", "Vyplňte název, popis, cenu větší než 0, stav a lokalitu.");
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      seller_id: user.id,
      title,
      description,
      price,
      category,
      subcategory,
      condition,
      location,
      status: "active"
    })
    .select("id")
    .single();

  if (error || !listing) {
    withError("/pridat-inzerat", "Inzerát se nepovedlo vytvořit.");
  }

  const photos = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0)
    .slice(0, 8);

  const imageRows = [];

  for (const [index, photo] of photos.entries()) {
    const fileName = normalizeFileName(photo.name) || `foto-${index + 1}.jpg`;
    const path = `${user.id}/${listing.id}/${crypto.randomUUID()}-${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(path, photo, {
        contentType: photo.type || "image/jpeg"
      });

    if (uploadError) {
      continue;
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from("listing-images").getPublicUrl(path);

    imageRows.push({
      listing_id: listing.id,
      image_url: publicUrl,
      sort_order: index
    });
  }

  if (imageRows.length > 0) {
    await supabase.from("listing_images").insert(imageRows);
  }

  revalidatePath("/inzeraty");
  revalidatePath("/moje-inzeraty");
  redirect(`/inzeraty/${listing.id}`);
}

export async function updateListingAction(formData: FormData) {
  const listingId = textField(formData, "listing_id");
  const title = textField(formData, "title");
  const description = textField(formData, "description");
  const category = textField(formData, "category");
  const subcategory = textField(formData, "subcategory");
  const location = textField(formData, "location");
  const condition = textField(formData, "condition") as ListingCondition;
  const status = textField(formData, "status") as ListingStatus;
  const price = Math.round(Number(textField(formData, "price").replace(/\s/g, "").replace(",", ".")));
  const path = listingId ? `/moje-inzeraty/${listingId}/upravit` : "/moje-inzeraty";

  if (!isValidListingCategory(category, subcategory)) {
    withError(path, "Vyberte hlavní kategorii a odpovídající podkategorii.");
  }

  if (!listingId) {
    withError("/moje-inzeraty", "Inzerát nebyl nalezen.");
  }

  if (
    !title ||
    !description ||
    !location ||
    Number.isNaN(price) ||
    price <= 0 ||
    !listingConditions.includes(condition) ||
    !listingStatuses.includes(status)
  ) {
    withError(path, "Vyplňte název, popis, cenu větší než 0, stav položky, lokalitu a status.");
  }

  const { supabase, user } = await requireUser(path);
  const { error } = await supabase
    .from("listings")
    .update({
      title,
      description,
      price,
      category,
      subcategory,
      condition,
      location,
      status
    })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (error) {
    withError(path, "Inzerát se nepovedlo uložit.");
  }

  revalidatePath("/moje-inzeraty");
  revalidatePath("/inzeraty");
  revalidatePath(`/inzeraty/${listingId}`);
  redirect("/moje-inzeraty?zprava=Inzerát je uložený.");
}

export async function startOrderAction(formData: FormData) {
  const listingId = textField(formData, "listing_id");
  const { supabase } = await requireUser(`/inzeraty/${listingId}`);
  const message = textField(formData, "message") || "Mám zájem o tento inzerát.";

  const { data: orderId, error } = await supabase.rpc("create_order_and_reserve", {
    p_listing_id: listingId,
    p_message: message
  });

  if (error || !orderId) {
    withError(`/inzeraty/${listingId}`, "Objednávku se nepovedlo vytvořit. Inzerát už může být rezervovaný.");
  }

  revalidatePath("/inzeraty");
  revalidatePath(`/inzeraty/${listingId}`);
  redirect(`/objednavky/${orderId}`);
}

export async function updateListingStatusAction(formData: FormData) {
  const listingId = textField(formData, "listing_id");
  const status = textField(formData, "status") as ListingStatus;

  if (!["active", "hidden", "sold"].includes(status)) {
    withError("/moje-inzeraty", "Neplatná akce inzerátu.");
  }

  const { supabase, user } = await requireUser("/moje-inzeraty");
  const { error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (error) {
    withError("/moje-inzeraty", "Stav inzerátu se nepovedlo změnit.");
  }

  revalidatePath("/moje-inzeraty");
  revalidatePath("/inzeraty");
  redirect("/moje-inzeraty");
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = textField(formData, "order_id");
  const status = textField(formData, "status") as OrderStatus;
  const { supabase } = await requireUser(`/objednavky/${orderId}`);

  if (!orderId || !orderStatuses.includes(status)) {
    withError(orderId ? `/objednavky/${orderId}` : "/moje-objednavky", "Neplatný stav objednávky.");
  }

  const { error } = await supabase.rpc("set_order_status", {
    p_order_id: orderId,
    p_status: status
  });

  if (error) {
    withError(`/objednavky/${orderId}`, "Stav objednávky se nepovedlo změnit.");
  }

  revalidatePath("/moje-objednavky");
  revalidatePath(`/objednavky/${orderId}`);
  redirect(`/objednavky/${orderId}`);
}

export async function sendMessageAction(formData: FormData) {
  const listingId = textField(formData, "listing_id");
  const receiverId = textField(formData, "receiver_id");
  const text = textField(formData, "text");
  const { supabase, user } = await requireUser(`/zpravy/${listingId}`);

  if (!text || !receiverId) {
    withError(`/zpravy/${listingId}`, "Zpráva musí mít text a příjemce.");
  }

  const { error } = await supabase.from("messages").insert({
    listing_id: listingId,
    sender_id: user.id,
    receiver_id: receiverId,
    text
  });

  if (error) {
    withError(`/zpravy/${listingId}`, "Zprávu se nepovedlo odeslat.");
  }

  revalidatePath(`/zpravy/${listingId}`);
  redirect(`/zpravy/${listingId}`);
}

export async function createReviewAction(formData: FormData) {
  const orderId = textField(formData, "order_id");
  const reviewedUserId = textField(formData, "reviewed_user_id");
  const rating = Number(textField(formData, "rating"));
  const reviewText = textField(formData, "text");
  const { supabase, user } = await requireUser(`/objednavky/${orderId}`);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    withError(`/objednavky/${orderId}`, "Vyberte hodnocení od 1 do 5.");
  }

  const { error } = await supabase.from("reviews").insert({
    order_id: orderId,
    reviewer_id: user.id,
    reviewed_user_id: reviewedUserId,
    rating,
    text: reviewText || null
  });

  if (error) {
    withError(`/objednavky/${orderId}`, "Hodnocení se nepovedlo uložit. Možná už je uloženo.");
  }

  revalidatePath(`/objednavky/${orderId}`);
  revalidatePath(`/uzivatel/${reviewedUserId}`);
  redirect(`/objednavky/${orderId}?zprava=Hodnocení je uložené.`);
}
