"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";
import { createPriceOfferAction } from "@/app/actions";
import { formatPrice } from "@/lib/format";

type PriceOfferModalProps = {
  listingId: string;
  title: string;
  price: number;
  imageUrl?: string;
};

export function PriceOfferModal({ listingId, title, price, imageUrl }: PriceOfferModalProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<"ten" | "twenty" | "custom">("ten");
  const tenPercent = Math.max(1, Math.round(price * 0.9));
  const twentyPercent = Math.max(1, Math.round(price * 0.8));
  const [customPrice, setCustomPrice] = useState(String(tenPercent));
  const proposedPrice = selected === "ten" ? tenPercent : selected === "twenty" ? twentyPercent : Number(customPrice.replace(/\s/g, "").replace(",", "."));
  const buyerProtectionPrice = useMemo(() => Math.round(proposedPrice * 1.08), [proposedPrice]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-moss bg-white px-5 py-3 text-base font-bold text-moss hover:bg-[#fff7df]"
      >
        Nabídnout cenu
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-3 py-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex min-h-14 items-center justify-between border-b border-line px-4">
              <h2 className="text-base font-bold text-ink">Nabídnout cenu</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-moss hover:bg-fog"
                aria-label="Zavřít nabídku ceny"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <form action={createPriceOfferAction} className="p-4">
              <input type="hidden" name="listing_id" value={listingId} />
              <input type="hidden" name="proposed_price" value={Number.isFinite(proposedPrice) ? Math.round(proposedPrice) : ""} />

              <div className="flex min-w-0 gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-fog">
                  {imageUrl ? <Image src={imageUrl} alt={title} fill sizes="56px" className="object-cover" /> : null}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-base font-semibold leading-6 text-ink">{title}</p>
                  <p className="text-sm text-zinc-600">Cena předmětu: {formatPrice(price)}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <OfferOption active={selected === "ten"} price={tenPercent} label="10% sleva" onClick={() => setSelected("ten")} />
                <OfferOption active={selected === "twenty"} price={twentyPercent} label="20% sleva" onClick={() => setSelected("twenty")} />
                <button
                  type="button"
                  onClick={() => setSelected("custom")}
                  className={
                    selected === "custom"
                      ? "rounded-lg border border-moss bg-[#fff7df] p-3 text-left"
                      : "rounded-lg border border-line bg-white p-3 text-left hover:border-moss"
                  }
                >
                  <span className="block text-base font-semibold text-ink">Vlastní</span>
                  <span className="mt-1 block text-xs font-semibold text-moss">Urči cenu</span>
                </button>
              </div>

              <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="custom-price">
                Nabídnutá cena
              </label>
              <input
                id="custom-price"
                inputMode="numeric"
                type="number"
                min={1}
                max={price - 1}
                value={selected === "custom" ? customPrice : proposedPrice}
                onFocus={() => setSelected("custom")}
                onChange={(event) => {
                  setSelected("custom");
                  setCustomPrice(event.currentTarget.value);
                }}
                className="mt-2 border-x-0 border-t-0 border-moss px-0 py-2 text-lg font-semibold focus:ring-0"
              />
              <p className="mt-1 text-xs text-zinc-600">
                {Number.isFinite(buyerProtectionPrice) ? `${formatPrice(buyerProtectionPrice)} vč. orientační ochrany kupujících.` : "Zadejte cenu."}
              </p>

              <p className="mt-5 text-sm leading-6 text-zinc-600">
                Prodávající uvidí nabídku v chatu a může ji přijmout nebo odmítnout. Původní cena inzerátu se veřejně nezmění.
              </p>

              <div className="mt-6">
                <SubmitButton
                  pendingText="Odesílám nabídku..."
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-moss px-5 py-3 text-base font-bold text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Navrhnout
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function OfferOption({ active, price, label, onClick }: { active: boolean; price: number; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "rounded-lg border border-moss bg-[#fff7df] p-3 text-left" : "rounded-lg border border-line bg-white p-3 text-left hover:border-moss"}
    >
      <span className="block text-base font-semibold text-ink">{formatPrice(price)}</span>
      <span className="mt-1 block text-xs font-semibold text-moss">{label}</span>
    </button>
  );
}
