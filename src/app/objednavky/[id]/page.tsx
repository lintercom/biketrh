import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { CheckCircle, MessageCircle, Star, XCircle } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { SubmitButton } from "@/components/SubmitButton";
import { createReviewAction, updateOrderStatusAction } from "@/app/actions";
import { formatPrice, formatShortDate } from "@/lib/format";
import { getCurrentUserProfile, getOrderById } from "@/lib/data";
import type { OrderStatus } from "@/lib/types";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ chyba?: string; zprava?: string }>;
};

export default async function OrderDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { chyba, zprava } = await searchParams;
  const { user } = await getCurrentUserProfile();

  if (!user) {
    redirect(`/prihlaseni?next=/objednavky/${id}`);
  }

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const isSeller = order.seller_id === user.id;
  const otherProfile = isSeller ? order.buyer : order.seller;
  const hasReviewed = order.reviews.some((review) => review.reviewer_id === user.id);
  const reviewedUserId = isSeller ? order.buyer_id : order.seller_id;
  const image = order.listing.images[0]?.image_url;

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 md:px-6 md:py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-moss">Objednávka</p>
      <div className="mt-1 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <h1 className="text-3xl font-black text-ink">{order.listing.title}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      {chyba ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div> : null}
      {zprava ? <div className="mt-5 rounded-lg border border-line bg-white p-4 text-sm text-zinc-700">{zprava}</div> : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="space-y-5">
          <div className="rounded-lg border border-line bg-white p-4 shadow-soft">
            <div className="flex gap-4">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-fog">
                {image ? <img src={image} alt={order.listing.title} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-ink">{order.listing.title}</h2>
                <p className="mt-1 text-xl font-black text-ink">{formatPrice(order.listing.price)}</p>
                <p className="mt-2 text-sm text-zinc-600">{order.listing.location}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-lg font-bold text-ink">Účastníci</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PersonBlock label="Kupující" name={order.buyer.display_name} city={order.buyer.city} avatar={order.buyer} />
              <PersonBlock label="Prodávající" name={order.seller.display_name} city={order.seller.city} avatar={order.seller} />
            </div>
          </div>

          {order.status === "completed" ? (
            <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <h2 className="text-lg font-bold text-ink">Hodnocení po obchodu</h2>
              {hasReviewed ? (
                <p className="mt-3 rounded-lg bg-fog p-4 text-sm text-zinc-700">Hodnocení už je uložené.</p>
              ) : (
                <form action={createReviewAction} className="mt-4 space-y-4">
                  <input type="hidden" name="order_id" value={order.id} />
                  <input type="hidden" name="reviewed_user_id" value={reviewedUserId} />
                  <div>
                    <label className="text-sm font-semibold text-ink" htmlFor="rating">
                      Hodnocení pro {otherProfile.display_name}
                    </label>
                    <select id="rating" name="rating" required defaultValue="5" className="mt-2 px-3 py-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} z 5
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-ink" htmlFor="text">
                      Krátký komentář
                    </label>
                    <textarea id="text" name="text" rows={3} maxLength={1000} className="mt-2 px-3 py-3" />
                  </div>
                  <SubmitButton pendingText="Ukládám hodnocení...">
                    <span className="inline-flex items-center gap-2">
                      <Star className="h-4 w-4" aria-hidden="true" />
                      Uložit hodnocení
                    </span>
                  </SubmitButton>
                </form>
              )}
            </div>
          ) : null}
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-lg font-bold text-ink">Stav</h2>
            <p className="mt-2 text-sm text-zinc-600">Vytvořeno {formatShortDate(order.created_at)}</p>
            <div className="mt-4 space-y-2">
              {isSeller && order.status === "created" ? (
                <OrderAction orderId={order.id} status="accepted" label="Přijmout" icon={<CheckCircle className="h-4 w-4" />} primary />
              ) : null}
              {["created", "accepted"].includes(order.status) ? (
                <OrderAction orderId={order.id} status="completed" label="Dokončit" icon={<CheckCircle className="h-4 w-4" />} primary />
              ) : null}
              {["created", "accepted"].includes(order.status) ? (
                <OrderAction orderId={order.id} status="cancelled" label="Zrušit" icon={<XCircle className="h-4 w-4" />} />
              ) : null}
              <Link
                href={`/zpravy/${order.listing_id}`}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-fog"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Zprávy k inzerátu
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PersonBlock({
  label,
  name,
  city,
  avatar
}: {
  label: string;
  name: string;
  city: string;
  avatar: Parameters<typeof Avatar>[0]["profile"];
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-fog p-3">
      <Avatar profile={avatar} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
        <p className="font-semibold text-ink">{name}</p>
        <p className="text-sm text-zinc-600">{city}</p>
      </div>
    </div>
  );
}

function OrderAction({
  orderId,
  status,
  label,
  icon,
  primary = false
}: {
  orderId: string;
  status: OrderStatus;
  label: string;
  icon: ReactNode;
  primary?: boolean;
}) {
  return (
    <form action={updateOrderStatusAction}>
      <input type="hidden" name="order_id" value={orderId} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={
          primary
            ? "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white hover:bg-ink"
            : "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-fog"
        }
      >
        {icon}
        {label}
      </button>
    </form>
  );
}
