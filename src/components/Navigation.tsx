"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Camera,
  ChevronDown,
  CirclePlus,
  Grid2X2,
  HelpCircle,
  Home,
  List,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  User,
  X
} from "lucide-react";
import { clsx } from "clsx";
import { signOutAction } from "@/app/actions";
import { catalogCategories, categoryHref } from "@/lib/catalog";
import type { Profile } from "@/lib/types";

const mobileMenuItems = [
  { href: "/inzeraty", label: "Inzeráty", icon: List },
  { href: "/pridat-inzerat", label: "Přidat inzerát", icon: CirclePlus },
  { href: "/moje-inzeraty", label: "Moje inzeráty", icon: List },
  { href: "/moje-objednavky", label: "Moje objednávky", icon: ShoppingBag },
  { href: "/profil", label: "Profil", icon: User },
  { href: "/prihlaseni", label: "Přihlášení", icon: User },
  { href: "/registrace", label: "Registrace", icon: User },
  { href: categoryHref("Komponenty"), label: "Komponenty", icon: Grid2X2 }
];

const bottomNavItems = [
  { href: "/", label: "Domů", icon: Home, match: ["/"] },
  { href: "/inzeraty", label: "Procházet", icon: Search, match: ["/inzeraty", "/uzivatel", "/uzivatele"] },
  { href: "/pridat-inzerat", label: "Prodávat", icon: CirclePlus, match: ["/pridat-inzerat"] },
  { href: "/moje-objednavky", label: "Zprávy", icon: MessageCircle, match: ["/moje-objednavky", "/objednavky", "/zpravy"] },
  { href: "/profil", label: "Profil", icon: User, match: ["/profil", "/prihlaseni", "/registrace"] }
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isBottomActive(pathname: string, matches: string[]) {
  return matches.some((match) => {
    if (match === "/") {
      return pathname === "/";
    }

    return pathname === match || pathname.startsWith(`${match}/`);
  });
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={clsx("shrink-0 font-black italic leading-none text-black", compact ? "text-[30px]" : "text-[42px]")}>
      Bike<span className="text-moss">Trh</span>
    </Link>
  );
}

export function Navigation({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const [searchTarget, setSearchTarget] = useState<"listings" | "users">("listings");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchAction = searchTarget === "users" ? "/uzivatele" : "/inzeraty";
  const searchPlaceholder = searchTarget === "users" ? "Hledat uživatele" : "Hledat komponenty";

  return (
    <>
      <header className="sticky top-0 z-40 hidden border-b border-line bg-white/95 backdrop-blur md:block">
        <div className="mx-auto flex h-24 max-w-[1800px] items-center gap-5 px-8">
          <Logo />

          <div className="flex min-w-[520px] flex-1 items-center overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-[0_2px_8px_rgba(23,32,27,0.04)]">
            <div className="relative h-14 shrink-0 border-r border-zinc-300">
              <label htmlFor="search-target" className="sr-only">
                Co hledat
              </label>
              <select
                id="search-target"
                value={searchTarget}
                onChange={(event) => setSearchTarget(event.target.value === "users" ? "users" : "listings")}
                className="h-14 w-56 cursor-pointer appearance-none border-0 bg-white px-7 pr-12 text-lg font-semibold text-ink shadow-none focus:border-0 focus:shadow-none"
              >
                <option value="listings">Inzeráty</option>
                <option value="users">Uživatelé</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
            </div>
            <form action={searchAction} className="flex h-14 min-w-0 flex-1 items-center gap-4 px-6">
              <Search className="h-6 w-6 shrink-0 text-zinc-500" aria-hidden="true" />
              <label htmlFor="site-search" className="sr-only">
                {searchPlaceholder}
              </label>
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder={searchPlaceholder}
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-lg text-ink shadow-none placeholder:text-zinc-500 focus:border-0 focus:shadow-none"
              />
              {searchTarget === "listings" ? <Camera className="h-6 w-6 shrink-0 text-moss" aria-hidden="true" /> : null}
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
          <div className="mx-auto flex h-16 max-w-[1800px] items-center gap-10 overflow-hidden px-8">
            {catalogCategories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.label}
                  href={categoryHref(category.label)}
                  className="relative inline-flex h-16 shrink-0 items-center gap-2 text-lg font-semibold text-ink hover:text-moss"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {category.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur md:hidden">
        <div className="mobile-safe-top flex min-h-14 items-center justify-between gap-3 px-4">
          <Logo compact />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-fog"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Zavřít menu" : "Otevřít menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="h-7 w-7" aria-hidden="true" /> : <Menu className="h-7 w-7" aria-hidden="true" />}
          </button>
        </div>

        <div className="border-t border-line px-4 py-3">
          <form action="/inzeraty" className="flex min-h-12 items-center gap-3 rounded-lg border border-zinc-300 bg-white px-3">
            <Search className="h-5 w-5 shrink-0 text-zinc-500" aria-hidden="true" />
            <label htmlFor="mobile-site-search" className="sr-only">
              Hledat komponenty
            </label>
            <input
              id="mobile-site-search"
              name="q"
              type="search"
              placeholder="Hledat komponenty..."
              className="h-12 min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-base text-ink shadow-none placeholder:text-zinc-500 focus:border-0 focus:shadow-none"
            />
          </form>
        </div>

        {mobileMenuOpen ? (
          <div id="mobile-navigation" className="border-t border-line bg-white px-4 pb-4 shadow-[0_18px_30px_rgba(23,32,27,0.12)]">
            <nav className="grid gap-1 py-3" aria-label="Mobilní navigace">
              {mobileMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      "flex min-h-12 items-center gap-3 rounded-lg px-3 text-base font-semibold",
                      active ? "bg-[#fff7df] text-moss" : "text-ink hover:bg-fog"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {profile ? (
              <form action={signOutAction} className="border-t border-line pt-3">
                <button
                  type="submit"
                  className="flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-base font-semibold text-ink hover:bg-fog"
                >
                  <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
                  Odhlášení
                </button>
              </form>
            ) : null}
          </div>
        ) : null}
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_28px_rgba(23,32,27,0.08)] backdrop-blur md:hidden">
        <div className="grid h-16 grid-cols-5">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isBottomActive(pathname, item.match);
            const selling = item.href === "/pridat-inzerat";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold",
                  active ? "text-moss" : "text-zinc-500"
                )}
              >
                <span
                  className={clsx(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full",
                    selling && "bg-moss text-white",
                    active && !selling && "text-moss"
                  )}
                >
                  <Icon className={clsx("h-5 w-5", active ? "stroke-[2.5]" : "")} aria-hidden="true" />
                </span>
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
