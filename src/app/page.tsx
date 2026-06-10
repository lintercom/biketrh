import Link from "next/link";
import { ArrowRight, CirclePlus, ShieldCheck } from "lucide-react";
import { ConfigNotice } from "@/components/ConfigNotice";
import { ListingCard } from "@/components/ListingCard";
import { getListings } from "@/lib/data";

export default async function HomePage() {
  const listings = (await getListings()).slice(0, 4);

  return (
    <div>
      <section
        className="relative flex min-h-[500px] items-end bg-cover bg-center text-white sm:min-h-[580px] md:min-h-[660px]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(23,32,27,0.22), rgba(23,32,27,0.74)), url('https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1800&q=90')"
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-16 sm:px-5 md:px-8 md:pb-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black leading-[1.05] tracking-normal sm:text-5xl md:text-7xl">
              Jednodušší nákup a prodej cyklo vybavení z druhé ruky
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl sm:leading-9">
              Marketplace inspirovaný jednoduchostí Vinted, vytvořený pro bike komunitu.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inzeraty"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-base font-bold text-ink hover:bg-fog"
              >
                Prohlížet inzeráty
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/pridat-inzerat"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-4 text-base font-bold text-white hover:bg-moss"
              >
                <CirclePlus className="h-5 w-5" aria-hidden="true" />
                Přidat inzerát
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 md:px-8 md:py-14">
        <ConfigNotice />

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-5 md:grid-cols-3 md:px-8 md:py-12">
          {[
            ["Rychlé vložení", "Název, stav, lokalita, fotky a hotovo."],
            ["Důvěra v profilu", "Hodnocení a aktivní nabídky jsou vidět bez složitého hledání."],
            ["Obchod u inzerátu", "Objednávka i zprávy zůstávají navázané na konkrétní inzerát."]
          ].map(([title, text]) => (
            <div key={title} className="flex gap-4">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-moss" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-base leading-7 text-zinc-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
