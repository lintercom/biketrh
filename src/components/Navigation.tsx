"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Camera, ChevronDown, CirclePlus, Grid2X2, HelpCircle, Home, List, Search, ShoppingBag, User } from "lucide-react";
import { clsx } from "clsx";
import { catalogSections, categoryHref, defaultCatalogCategory, defaultCatalogSection } from "@/lib/catalog";
import type { CatalogCategory, CatalogSection } from "@/lib/catalog";
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

function CatalogMenu({
  section,
  category,
  onCategoryChange
}: {
  section: CatalogSection;
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
}) {
  const Icon = category.icon;
  const leftCategories = section.categories.length > 0 ? section.categories : [defaultCatalogCategory];
  const midpoint = Math.ceil(category.subcategories.length / 2);
  const subcategoryColumns = [category.subcategories.slice(0, midpoint), category.subcategories.slice(midpoint)].filter(
    (items) => items.length > 0
  );

  return (
    <div className="absolute left-8 right-8 top-full z-50 overflow-hidden rounded-lg border border-line bg-white shadow-[0_18px_50px_rgba(23,32,27,0.18)]">
      <div className="grid min-h-[420px] grid-cols-[280px_1fr_1fr] xl:grid-cols-[320px_1fr_1fr_380px]">
        <div className="border-r border-line py-5">
          <Link
            href={categoryHref()}
            className="flex min-h-14 items-center gap-4 px-6 text-base font-medium text-ink hover:bg-[#fff7df] xl:px-8 xl:text-lg"
          >
            <Grid2X2 className="h-6 w-6" aria-hidden="true" />
            Zobrazit vše
          </Link>

          {leftCategories.map((item) => {
            const ItemIcon = item.icon;
            const selected = item.slug === category.slug;

            return (
              <Link
                key={item.slug}
                href={categoryHref(item.slug)}
                onMouseEnter={() => onCategoryChange(item)}
                className={clsx(
                  "flex min-h-14 items-center gap-4 px-6 text-base font-semibold text-ink hover:bg-[#fff7df] xl:px-8 xl:text-lg",
                  selected && "bg-[#fff7df]"
                )}
              >
                <ItemIcon className={clsx("h-6 w-6", selected ? "text-moss" : "text-ink")} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <ChevronDown className="-rotate-90 h-5 w-5 text-zinc-500" aria-hidden="true" />
              </Link>
            );
          })}
        </div>

        {subcategoryColumns.map((items, columnIndex) => (
          <div key={columnIndex} className="border-r border-line px-7 py-10 xl:px-10 xl:py-12">
            <div className="grid gap-6">
              {items.map((subcategory) => (
                <Link
                  key={subcategory.slug}
                  href={categoryHref(subcategory.slug)}
                  className="group flex items-start gap-5 text-ink"
                >
                  <Icon className="mt-0.5 h-6 w-6 shrink-0 text-ink group-hover:text-moss" aria-hidden="true" />
                  <div>
                    <p className="text-base font-semibold group-hover:text-moss xl:text-lg">{subcategory.label}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-500">{subcategory.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {subcategoryColumns.length === 1 ? <div className="border-r border-line" /> : null}

        <div className="hidden p-7 xl:block xl:p-9">
          <div className="flex h-full flex-col justify-between rounded-lg bg-[#fff7df] p-8">
            <div>
              <div className="mb-6 inline-flex h-28 w-28 items-center justify-center rounded-lg bg-white/70 text-moss">
                <Icon className="h-20 w-20" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-black text-ink">{category.label}</h3>
              <p className="mt-4 max-w-xs text-lg leading-8 text-ink">{category.description}</p>
            </div>
            <Link
              href={categoryHref(category.slug)}
              className="mt-8 inline-flex w-fit min-h-12 items-center justify-center rounded-lg border border-moss bg-white px-5 py-3 text-base font-semibold text-moss hover:bg-moss hover:text-white"
            >
              Zobrazit všechny
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Navigation({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const items = profile ? signedInItems : signedOutItems;
  const [searchTarget, setSearchTarget] = useState<"listings" | "users">("listings");
  const [openSectionSlug, setOpenSectionSlug] = useState<string | null>(null);
  const [activeCategorySlug, setActiveCategorySlug] = useState(defaultCatalogCategory.slug);
  const searchAction = searchTarget === "users" ? "/uzivatele" : "/inzeraty";
  const searchPlaceholder = searchTarget === "users" ? "Hledat uživatele" : "Hledat komponenty";

  const activeSection = useMemo(
    () => catalogSections.find((section) => section.slug === openSectionSlug) ?? defaultCatalogSection,
    [openSectionSlug]
  );
  const activeCategory =
    activeSection.categories.find((category) => category.slug === activeCategorySlug) ?? activeSection.categories[0] ?? defaultCatalogCategory;

  function openSection(section: CatalogSection) {
    setOpenSectionSlug(section.slug);
    setActiveCategorySlug(section.categories[0]?.slug ?? defaultCatalogCategory.slug);
  }

  return (
    <>
      <header className="sticky top-0 z-40 hidden border-b border-line bg-white/95 backdrop-blur md:block">
        <div className="mx-auto flex h-24 max-w-[1800px] items-center gap-5 px-8">
          <Link href="/" className="shrink-0 text-[42px] font-black italic leading-none text-black">
            Bike<span className="text-moss">Trh</span>
          </Link>

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

        <div className="relative border-t border-line" onMouseLeave={() => setOpenSectionSlug(null)}>
          <div className="mx-auto flex h-16 max-w-[1800px] items-center gap-10 px-8">
            {catalogSections.map((section) => {
              const isOpen = section.slug === openSectionSlug;

              return (
                <Link
                  key={section.slug}
                  href={categoryHref(section.slug)}
                  onMouseEnter={() => openSection(section)}
                  onFocus={() => openSection(section)}
                  className={clsx(
                    "relative inline-flex h-16 items-center gap-2 text-lg font-semibold text-ink hover:text-moss",
                    isOpen && "text-moss"
                  )}
                >
                  {section.label}
                  {section.categories.length > 0 ? <ChevronDown className="h-4 w-4" aria-hidden="true" /> : null}
                  {isOpen ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-moss" /> : null}
                </Link>
              );
            })}
          </div>

          {openSectionSlug ? (
            <CatalogMenu
              section={activeSection}
              category={activeCategory}
              onCategoryChange={(category) => setActiveCategorySlug(category.slug)}
            />
          ) : null}
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
