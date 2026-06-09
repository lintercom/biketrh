import Link from "next/link";
import { ArrowRight, CirclePlus, ShieldCheck, Sparkles } from "lucide-react";
import { ConfigNotice } from "@/components/ConfigNotice";
import { ListingCard } from "@/components/ListingCard";
import { getListings } from "@/lib/data";

export default async function HomePage() {
  const listings = (await getListings()).slice(0, 4);

  return (
    <div>
      <section
        className="relative flex min-h-[460px] items-end bg-cover bg-center text-white sm:min-h-[540px] md:min-h-[620px]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(23,32,27,0.22), rgba(23,32,27,0.74)), url('https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1800&q=90')"
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-16 sm:px-5 md:px-6 md:pb-24">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              BikeTrh MVP
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-normal sm:text-4xl md:text-6xl">
              Jednodušší nákup a prodej cyklo komponentů z druhé ruky
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
              Marketplace inspirovaný jednoduchostí Vinted, vytvořený pro bike komunitu.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inzeraty"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-ink hover:bg-fog"
              >
                Prohlížet inzeráty
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/pridat-inzerat"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-leaf px-5 py-3 text-sm font-bold text-white hover:bg-moss"
              >
                <CirclePlus className="h-4 w-4" aria-hidden="true" />
                Přidat inzerát
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-5 md:px-6 md:py-12">
        <ConfigNotice />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-moss">Nejnovější nabídky</p>
            <h2 className="mt-1 text-xl font-bold text-ink sm:text-2xl">Komponenty, které právě hledají nové kolo</h2>
          </div>
          <Link href="/inzeraty" className="hidden text-sm font-semibold text-moss hover:text-ink sm:inline-flex">
            Zobrazit vše
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:px-5 md:grid-cols-3 md:px-6 md:py-10">
          {[
            ["Rychlé vložení", "Název, stav, lokalita, fotky a hotovo."],
            ["Důvěra v profilu", "Hodnocení a aktivní nabídky jsou vidět bez složitého hledání."],
            ["Obchod u inzerátu", "Objednávka i zprávy zůstávají navázané na konkrétní komponent."]
          ].map(([title, text]) => (
            <div key={title} className="flex gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
