import Image from "next/image";
import Link from "next/link";
import { Info, MapPin, Send, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { SubmitButton } from "@/components/SubmitButton";
import { respondPriceOfferAction, sendMessageAction } from "@/app/actions";
import { formatPrice, formatShortDate } from "@/lib/format";
import type { Conversation, PriceOffer } from "@/lib/types";

type ChatPanelProps = {
  conversation: Conversation;
  currentUserId: string;
};

export function ChatPanel({ conversation, currentUserId }: ChatPanelProps) {
  const image = conversation.listing.images[0]?.image_url;
  const effectivePrice = conversation.acceptedOffer?.proposed_price ?? conversation.listing.price;
  const hasAcceptedPrice = Boolean(conversation.acceptedOffer);

  return (
    <section className="flex min-h-[620px] min-w-0 flex-1 flex-col border-line bg-white md:border-l">
      <header className="flex min-h-14 items-center justify-center border-b border-line px-4">
        <h1 className="truncate text-xl font-bold text-moss">{conversation.receiver?.display_name ?? "Konverzace"}</h1>
        <Info className="ml-auto h-5 w-5 text-zinc-600" aria-hidden="true" />
      </header>

      <div className="flex min-w-0 items-center gap-3 border-b border-line p-4">
        <Link href={`/inzeraty/${conversation.listing.id}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-fog">
          {image ? <Image src={image} alt={conversation.listing.title} fill sizes="64px" className="object-cover" /> : null}
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/inzeraty/${conversation.listing.id}`} className="line-clamp-2 text-lg font-bold leading-6 text-ink hover:text-moss">
            {conversation.listing.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <p className="text-base text-zinc-600">{formatPrice(effectivePrice)}</p>
            {hasAcceptedPrice ? <p className="text-base text-zinc-500 line-through">{formatPrice(conversation.listing.price)}</p> : null}
          </div>
          <p className="text-base font-semibold text-moss">{formatPrice(Math.round(effectivePrice * 1.08))}</p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <Link
            href={`/inzeraty/${conversation.listing.id}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-moss bg-white px-4 text-base font-bold text-moss hover:bg-[#fff7df]"
          >
            Nabídnout cenu
          </Link>
          <Link
            href={`/inzeraty/${conversation.listing.id}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-moss px-4 text-base font-bold text-white hover:bg-ink"
          >
            Koupit
          </Link>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {conversation.receiver ? (
          <div className="flex justify-start">
            <div className="flex max-w-[88%] gap-3 sm:max-w-[78%]">
              <Avatar profile={conversation.receiver} size="sm" />
              <div className="rounded-lg border border-line bg-white px-4 py-3 text-ink shadow-soft">
                <p className="text-lg font-semibold">Ahoj, jsem {conversation.receiver.display_name}</p>
                <p className="mt-2 inline-flex items-center gap-2 text-base text-zinc-600">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {conversation.receiver.city || "Město není vyplněné"}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {conversation.messages.length > 0 ? (
          conversation.messages.map((message) => {
            const mine = message.sender_id === currentUserId;

            return (
              <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={mine ? "max-w-[88%] rounded-lg bg-[#eef4f3] px-4 py-3 text-ink sm:max-w-[78%]" : "max-w-[88%] rounded-lg bg-white px-4 py-3 text-ink shadow-soft sm:max-w-[78%]"}>
                  {message.price_offer ? (
                    <PriceOfferMessage
                      offer={message.price_offer}
                      listingId={conversation.listing.id}
                      receiverId={conversation.receiver?.id ?? ""}
                      currentUserId={currentUserId}
                    />
                  ) : (
                    <p className="whitespace-pre-line break-words text-[17px] leading-7">{message.text}</p>
                  )}
                  <p className="mt-1 text-right text-sm text-zinc-500">{formatShortDate(message.created_at)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-48 items-center justify-center text-center text-base text-zinc-500">
            Zatím tu nejsou žádné zprávy.
          </div>
        )}
      </div>

      <div className="border-t border-line bg-[#eef4f3] px-4 py-3 text-base leading-7 text-zinc-600">
        <span className="inline-flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
          Používej BikeTrh bezpečně. Nesdílej osobní údaje, neklikej na odkazy mimo BikeTrh a neskenuj neznámé QR kódy.
        </span>
      </div>

      {conversation.receiver ? (
        <form action={sendMessageAction} className="flex items-end gap-2 border-t border-line bg-white p-3">
          <input type="hidden" name="listing_id" value={conversation.listing.id} />
          <input type="hidden" name="receiver_id" value={conversation.receiver.id} />
          <label className="sr-only" htmlFor="text">
            Zpráva
          </label>
          <textarea
            id="text"
            name="text"
            rows={1}
            required
            maxLength={2000}
            placeholder="Poslat zprávu"
            className="min-h-12 resize-none rounded-lg border-line bg-fog px-4 py-3 text-base"
          />
          <SubmitButton
            pendingText="..."
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-moss text-white hover:bg-ink disabled:opacity-70"
          >
            <Send className="h-5 w-5" aria-hidden="true" />
          </SubmitButton>
        </form>
      ) : null}
    </section>
  );
}

function PriceOfferMessage({
  offer,
  listingId,
  receiverId,
  currentUserId
}: {
  offer: PriceOffer;
  listingId: string;
  receiverId: string;
  currentUserId: string;
}) {
  const isSeller = offer.seller_id === currentUserId;
  const pending = offer.status === "pending";
  const statusText =
    offer.status === "pending"
      ? "Čeká na potvrzení"
      : offer.status === "accepted"
        ? "Nabídka přijata"
        : offer.status === "rejected"
          ? "Nabídka odmítnuta"
          : "Nabídka zrušena";

  return (
    <div>
      <div className="rounded-lg border border-line bg-[#eef4f3] p-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-xl font-bold text-ink">{formatPrice(offer.proposed_price)}</span>
          <span className="text-base text-zinc-500 line-through">{formatPrice(offer.original_price)}</span>
        </div>
        <p className="mt-1 text-base text-zinc-700">{statusText}</p>
      </div>

      {isSeller && pending ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <form action={respondPriceOfferAction}>
            <input type="hidden" name="listing_id" value={listingId} />
            <input type="hidden" name="receiver_id" value={receiverId} />
            <input type="hidden" name="offer_id" value={offer.id} />
            <input type="hidden" name="status" value="accepted" />
            <SubmitButton
              pendingText="Ukládám..."
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-moss px-4 py-2 text-base font-bold text-white hover:bg-ink disabled:opacity-70"
            >
              Přijmout
            </SubmitButton>
          </form>
          <form action={respondPriceOfferAction}>
            <input type="hidden" name="listing_id" value={listingId} />
            <input type="hidden" name="receiver_id" value={receiverId} />
            <input type="hidden" name="offer_id" value={offer.id} />
            <input type="hidden" name="status" value="rejected" />
            <SubmitButton
              pendingText="Ukládám..."
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-line bg-white px-4 py-2 text-base font-bold text-zinc-700 hover:bg-fog disabled:opacity-70"
            >
              Odmítnout
            </SubmitButton>
          </form>
        </div>
      ) : null}
    </div>
  );
}
