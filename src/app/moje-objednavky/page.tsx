import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { formatPrice, formatShortDate } from "@/lib/format";
import { getCurrentUserProfile, getOrdersForUser } from "@/lib/data";
import type { OrderWithDetails } from "@/lib/types";

export default async function MyOrdersPage() {
  const { user } = await getCurrentUserProfile();

  if (!user) {
    redirect("/prihlaseni?next=/moje-objednavky");
  }

  const orders = await getOrdersForUser(user.id);
  const buying = orders.filter((order) => order.buyer_id === user.id);
  const selling = orders.filter((order) => order.seller_id === user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-5 md:px-6 md:py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-moss">Objednávky</p>
      <h1 className="mt-1 text-2xl font-black text-ink sm:text-3xl">Moje objednávky</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <OrderSection title="Nakupuji" orders={buying} currentUserId={user.id} empty="Zatím nemáte žádné nákupy." />
        <OrderSection title="Prodávám" orders={selling} currentUserId={user.id} empty="Zatím nemáte žádné objednávky od kupujících." />
      </div>
    </div>
  );
}

function OrderSection({
  title,
  orders,
  currentUserId,
  empty
}: {
  title: string;
  orders: OrderWithDetails[];
  currentUserId: string;
  empty: string;
}) {
  return (
    <section className="min-w-0">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-3 space-y-3">
        {orders.length > 0 ? (
          orders.map((order) => <OrderRow key={order.id} order={order} currentUserId={currentUserId} />)
        ) : (
          <EmptyState title={empty} text="Jakmile vznikne rezervace u inzerátu, najdete ji tady." />
        )}
      </div>
    </section>
  );
}

function OrderRow({ order, currentUserId }: { order: OrderWithDetails; currentUserId: string }) {
  const image = order.listing.images[0]?.image_url;
  const otherProfile = order.buyer_id === currentUserId ? order.seller : order.buyer;

  return (
    <Link
      href={`/objednavky/${order.id}`}
      className="flex min-w-0 gap-3 rounded-lg border border-line bg-white p-3 shadow-soft hover:border-moss"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-fog">
        {image ? <img src={image} alt={order.listing.title} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-semibold leading-5 text-ink">{order.listing.title}</h3>
            <p className="mt-1 text-sm font-bold text-ink">{formatPrice(order.listing.price)}</p>
            <p className="mt-1 truncate text-xs text-zinc-600">S {otherProfile.display_name}</p>
            <p className="mt-1 text-xs text-zinc-500">Vytvořeno {formatShortDate(order.created_at)}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
        </div>
        <div className="mt-2">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>
    </Link>
  );
}
