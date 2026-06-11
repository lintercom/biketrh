"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  CirclePlus,
  Grid2X2,
  Heart,
  Home,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Search,
  Shirt,
  ShoppingBag,
  User,
  X
} from "lucide-react";
import { clsx } from "clsx";
import { Avatar } from "@/components/Avatar";
import { signOutAction } from "@/app/actions";
import { catalogCategories, categoryHref, type CatalogIconName } from "@/lib/catalog";
import type { Profile } from "@/lib/types";

const categoryIcons: Record<CatalogIconName, typeof Grid2X2> = {
  accessories: ShoppingBag,
  components: Grid2X2,
  clothing: Shirt
};

const mobileMenuItems = [
  { href: categoryHref("Doplňky a příslušenství"), label: "Doplňky", icon: ShoppingBag },
  { href: categoryHref("Komponenty"), label: "Komponenty", icon: Grid2X2 },
  { href: categoryHref("Oblečení a obuv"), label: "Oblečení a obuv", icon: Shirt }
];

const bottomNavItems = [
  { href: "/", label: "Domů", icon: Home, match: ["/"] },
  { href: "/inzeraty", label: "Procházet", icon: Search, match: ["/inzeraty", "/uzivatel", "/uzivatele"] },
  { href: "/pridat-inzerat", label: "Prodávat", icon: CirclePlus, match: ["/pridat-inzerat"] },
  { href: "/zpravy", label: "Zprávy", icon: MessageCircle, match: ["/zpravy"] },
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
    <Link href="/" className={clsx("shrink-0 font-black italic leading-none text-black", compact ? "text-[30px]" : "text-[36px]")}>
      Bike<span className="text-moss">Trh</span>
    </Link>
  );
}

export function Navigation({ profile, unreadMessages = 0 }: { profile: Profile | null; unreadMessages?: number }) {
  const pathname = usePathname();
  const [searchTarget, setSearchTarget] = useState<"listings" | "users">("listings");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeDesktopCategory, setActiveDesktopCategory] = useState<string | null>(null);
  const desktopCategoryRef = useRef<HTMLDivElement>(null);
  const mobileHeaderRef = useRef<HTMLElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchAction = searchTarget === "users" ? "/uzivatele" : "/inzeraty";
  const searchPlaceholder = searchTarget === "users" ? "Hledat uživatele" : "Hledat vybavení";

  useEffect(() => {
    function closeOpenMenus(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (profileMenuOpen && !profileMenuRef.current?.contains(target)) {
        setProfileMenuOpen(false);
      }

      if (activeDesktopCategory && !desktopCategoryRef.current?.contains(target)) {
        setActiveDesktopCategory(null);
      }

      if (mobileMenuOpen && !mobileHeaderRef.current?.contains(target)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOpenMenus);
    return () => document.removeEventListener("pointerdown", closeOpenMenus);
  }, [activeDesktopCategory, mobileMenuOpen, profileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 hidden border-b border-line bg-white/95 backdrop-blur md:block">
        <div className="mx-auto flex h-20 max-w-[1800px] items-center gap-4 px-8">
          <Logo />

          <div className="flex min-w-[520px] flex-1 items-center overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-[0_2px_8px_rgba(23,32,27,0.04)]">
            <div className="relative h-12 shrink-0 border-r border-zinc-300">
              <label htmlFor="search-target" className="sr-only">
                Co hledat
              </label>
              <select
                id="search-target"
                value={searchTarget}
                onChange={(event) => setSearchTarget(event.target.value === "users" ? "users" : "listings")}
                className="h-12 w-52 cursor-pointer appearance-none border-0 bg-white px-6 pr-11 text-base font-semibold text-ink shadow-none focus:border-0 focus:shadow-none"
              >
                <option value="listings">Inzeráty</option>
                <option value="users">Uživatelé</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
            </div>
            <form action={searchAction} className="flex h-12 min-w-0 flex-1 items-center gap-3 px-5">
              <Search className="h-5 w-5 shrink-0 text-zinc-500" aria-hidden="true" />
              <label htmlFor="site-search" className="sr-only">
                {searchPlaceholder}
              </label>
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder={searchPlaceholder}
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-base text-ink shadow-none placeholder:text-zinc-500 focus:border-0 focus:shadow-none"
              />
            </form>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {profile ? (
              <div className="flex items-center gap-2">
                <DesktopIconLink href="/zpravy" label="Zprávy" badge={unreadMessages}>
                  <Mail className="h-6 w-6" aria-hidden="true" />
                </DesktopIconLink>
                <DesktopIconLink href="/moje-objednavky" label="Notifikace">
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </DesktopIconLink>
                <DesktopIconLink href="/moje-inzeraty" label="Oblíbené">
                  <Heart className="h-6 w-6" aria-hidden="true" />
                </DesktopIconLink>
                <div ref={profileMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((open) => !open)}
                    className="inline-flex h-12 items-center gap-2 rounded-lg px-2 hover:bg-fog"
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="menu"
                    aria-label="Otevřít profilové menu"
                  >
                    <Avatar profile={profile} size="sm" />
                    <ChevronDown className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                  </button>

                  {profileMenuOpen ? (
                    <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-lg border border-line bg-white py-2 shadow-[0_18px_30px_rgba(23,32,27,0.16)]" role="menu">
                      <ProfileMenuLink href="/profil" onClick={() => setProfileMenuOpen(false)}>
                        Nastavení profilu
                      </ProfileMenuLink>
                      <ProfileMenuLink href="/moje-inzeraty" onClick={() => setProfileMenuOpen(false)}>
                        Moje inzeráty
                      </ProfileMenuLink>
                      <ProfileMenuLink href="/moje-objednavky" onClick={() => setProfileMenuOpen(false)}>
                        Moje objednávky
                      </ProfileMenuLink>
                      <form action={signOutAction} className="border-t border-line pt-2">
                        <button
                          type="submit"
                          className="block w-full px-4 py-2.5 text-left text-base font-medium text-zinc-600 hover:bg-fog hover:text-ink"
                          role="menuitem"
                        >
                          Odhlásit
                        </button>
                      </form>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="inline-flex min-h-12 items-center rounded-lg border border-moss bg-white px-5 text-base font-semibold text-moss">
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
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-moss px-5 text-base font-bold text-white shadow-[0_4px_12px_rgba(230,175,0,0.28)] hover:bg-[#c99700]"
            >
              Přidat inzerát
            </Link>
          </div>
        </div>

        <div ref={desktopCategoryRef} className="relative border-t border-line" onMouseLeave={() => setActiveDesktopCategory(null)}>
          <div className="mx-auto flex h-14 max-w-[1800px] items-center gap-2 px-8">
            {catalogCategories.map((category) => {
              const Icon = categoryIcons[category.icon];
              const active = activeDesktopCategory === category.label;

              return (
                <div key={category.label} className="h-14" onMouseEnter={() => setActiveDesktopCategory(category.label)}>
                  <Link
                    href={categoryHref(category.label)}
                    className={clsx("relative inline-flex h-14 shrink-0 items-center gap-2 px-4 text-base font-semibold hover:text-moss", active ? "text-moss" : "text-ink")}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {category.label}
                    <ChevronDown className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                    {active ? <span className="absolute inset-x-4 bottom-0 h-0.5 bg-moss" /> : null}
                  </Link>

                  {active ? (
                    <div className="absolute left-0 right-0 top-14 z-50 border-t border-line bg-white shadow-[0_18px_30px_rgba(23,32,27,0.12)]">
                      <div className="mx-auto max-w-[1800px] px-8 py-6">
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.label}
                              href={categoryHref(category.label, subcategory.label)}
                              onClick={() => setActiveDesktopCategory(null)}
                              className="rounded-lg px-4 py-3 text-base font-semibold text-ink hover:bg-fog hover:text-moss"
                            >
                              {subcategory.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <header ref={mobileHeaderRef} className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur md:hidden">
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
              Hledat vybavení
            </label>
            <input
              id="mobile-site-search"
              name="q"
              type="search"
              placeholder="Hledat vybavení..."
              className="h-12 min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-base text-ink shadow-none placeholder:text-zinc-500 focus:border-0 focus:shadow-none"
            />
          </form>
        </div>

        {mobileMenuOpen ? (
          <div id="mobile-navigation" className="border-t border-line bg-white pb-4 shadow-[0_18px_30px_rgba(23,32,27,0.12)]">
            <div className="space-y-2 border-b border-line px-4 py-4 text-center">
              <Link
                href="/pridat-inzerat"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-moss px-5 py-3 text-sm font-bold text-white hover:bg-[#c99700]"
              >
                Přidat inzerát
              </Link>

              {profile ? (
                <Link
                  href="/profil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-moss bg-white px-5 py-3 text-sm font-semibold text-moss hover:bg-[#fff7df]"
                >
                  Profil
                </Link>
              ) : (
                <div className="flex min-h-11 items-center justify-center rounded-lg border border-moss bg-white px-5 py-3 text-sm font-semibold text-moss">
                  <Link href="/registrace" onClick={() => setMobileMenuOpen(false)} className="hover:text-ink">
                    Registruj se
                  </Link>
                  <span className="mx-2 text-moss">|</span>
                  <Link href="/prihlaseni" onClick={() => setMobileMenuOpen(false)} className="hover:text-ink">
                    Přihlas se
                  </Link>
                </div>
              )}

              <Link href="/inzeraty" onClick={() => setMobileMenuOpen(false)} className="inline-flex min-h-10 items-center text-sm font-semibold text-moss hover:text-ink">
                Průvodce po BikeTrh
              </Link>
            </div>

            <nav className="grid gap-1 px-4 py-3" aria-label="Mobilní navigace">
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

function DesktopIconLink({ href, label, badge, children }: { href: string; label: string; badge?: number; children: ReactNode }) {
  return (
    <Link href={href} className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg text-zinc-700 hover:bg-fog hover:text-ink" aria-label={label}>
      {children}
      {badge ? (
        <span className="absolute right-1.5 top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

function ProfileMenuLink({ href, onClick, children }: { href: string; onClick: () => void; children: ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="block px-4 py-2.5 text-base font-medium text-zinc-600 hover:bg-fog hover:text-ink" role="menuitem">
      {children}
    </Link>
  );
}
