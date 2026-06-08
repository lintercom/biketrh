import { clsx } from "clsx";
import { listingStatusLabels, orderStatusLabels } from "@/lib/format";
import type { ListingStatus, OrderStatus } from "@/lib/types";

const listingTone: Record<ListingStatus, string> = {
  active: "bg-leaf/10 text-moss",
  reserved: "bg-amber-100 text-amber-800",
  sold: "bg-ink/10 text-ink",
  hidden: "bg-zinc-100 text-zinc-600"
};

const orderTone: Record<OrderStatus, string> = {
  created: "bg-sky-100 text-sky-800",
  accepted: "bg-leaf/10 text-moss",
  cancelled: "bg-zinc-100 text-zinc-600",
  completed: "bg-ink/10 text-ink"
};

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", listingTone[status])}>
      {listingStatusLabels[status]}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", orderTone[status])}>
      {orderStatusLabels[status]}
    </span>
  );
}
