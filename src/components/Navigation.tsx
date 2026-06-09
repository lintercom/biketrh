"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, ChevronDown, CirclePlus, HelpCircle, Home, List, Search, ShoppingBag, User } from "lucide-react";
import { clsx } from "clsx";
import type { Profile } from "@/lib/types";

const signedInItems = [
  { href: "/", label: "Domů", icon: Home },
  { href: "/inzeraty", label: "Inzeráty", icon: List },
  { href: "/pridat-inzerat", label: "Přidat", icon: CirclePlus },
  { href: "/moje-inzeraty", label: "Moje inzeráty", icon: List },
  { href: "/moje-objednavky", label: "Objednávky", icon: ShoppingBag },
  { href: "/profil", label: "Profil", icon: User }
];

const signedOutItems = [
  { href: "/", label: "Domů", icon: Home },
  { href: "/inzeraty", label: "Inzeráty", icon: List },
  { href: "/pridat-inzerat", label: "Přidat", icon: CirclePlus },
  { href: "/prihlaseni", label: "Přihlášení", icon: User },
  { href: "/registrace", label: "Registrace", icon: User }
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const items = profile ? signedInItems : signedOutItems;

  return (
    <>
      <header className="sticky top-0 z-40 hidden border-b border-line bg-white/95 backdrop-blur md:block">
        <div className="mx-auto flex h-24 max-w-[1800px] items-center gap-5 px-8">
          <Link href="/" className="shrink-0 text-[42px] font-black italic leading-none text-black">
            Bike<span className="text-moss">Trh</span>
          </Link>

          <div className="flex min-w-[520px] flex-1 items-center overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-[0_2px_8px_rgba(23,32,27,0.04)]">
            <Link
              href="/inzeraty"
              className="inline-flex h-14 shrink-0 items-center gap-5 border-r border-zinc-300 px-7 text-lg font-semibold text-ink hover:bg-fog"
            >
              Komponenty
              <ChevronDown className="h-5 w-5 text-zinc-500" aria-hidden="true" />
            </Link>
            <form action="/inzeraty" className="flex h-14 min-w-0 flex-1 items-center gap-4 px-6">
              <Search className="h-6 w-6 shrink-0 text-zinc-500" aria-hidden="true" />
              <label htmlFor="site-search" className="sr-only">
                Hledat komponenty
              </label>
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="Hledat komponenty"
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-lg text-ink shadow-none placeholder:text-zinc-500 focus:border-0 focus:shadow-none"
              />
              <Camera className="h-6 w-6 shrink-0 text-moss" aria-hidden="true" />
            </form>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {profile ? (
              <Link
                href="/profil"
                className="inline-flex min-h-14 items-center justify-center rounded-lg border border-moss bg-white px-5 text-lg font-semibold text-moss hover:bg-moss/10"
              >
                {profile.display_name}
              </Link>
            ) : (
              <div className="inline-flex min-h-14 items-center rounded-lg border border-moss bg-white px-5 text-lg font-semibold text-moss">
                <Link href="/prihlaseni" className="hover:text-ink">
                  Přihlásit se
                </Link>
                <span className="mx-2 text-moss">|</span>
                <Link href="/registrace" className="hover:text-ink">
                  Registrovat se
                </Link>
              </div>
            )}

            <Link
              href="/pridat-inzerat"
              className="inline-flex min-h-14 items-center justify-center rounded-lg bg-moss px-5 text-lg font-bold text-white shadow-[0_4px_12px_rgba(230,175,0,0.28)] hover:bg-[#c99700]"
            >
              Přidat inzerát
            </Link>

            <Link
              href="/inzeraty"
              aria-label="Nápověda"
              className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-50 text-zinc-600 hover:bg-fog"
            >
              <HelpCircle className="h-8 w-8" aria-hidden="true" />
            </Link>

            <button
              type="button"
              className="inline-flex min-h-14 items-center gap-2 rounded-lg bg-white px-3 text-lg font-semibold text-zinc-700"
              aria-label="Jazyk"
            >
              CZ
              <ChevronDown className="h-5 w-5 text-zinc-500" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="border-t border-line">
          <div className="mx-auto flex h-16 max-w-[1800px] items-center px-8">
            <Link href="/inzeraty" className="text-lg font-semibold text-ink hover:text-moss">
              Komponenty
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_28px_rgba(23,32,27,0.08)] backdrop-blur md:hidden">
        <div className={profile ? "grid h-16 grid-cols-6" : "grid h-16 grid-cols-5"}>
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold",
                  active ? "text-moss" : "text-zinc-500"
                )}
              >
                <Icon className={clsx("h-5 w-5", active ? "stroke-[2.5]" : "")} aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
