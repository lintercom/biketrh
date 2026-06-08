"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, CirclePlus, Home, List, ShoppingBag, User } from "lucide-react";
import { clsx } from "clsx";
import type { Profile } from "@/lib/types";

const items = [
  { href: "/", label: "Domů", icon: Home },
  { href: "/inzeraty", label: "Inzeráty", icon: List },
  { href: "/pridat-inzerat", label: "Přidat", icon: CirclePlus },
  { href: "/moje-objednavky", label: "Objednávky", icon: ShoppingBag },
  { href: "/profil", label: "Profil", icon: User }
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 hidden border-b border-line bg-white/95 backdrop-blur md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white">
              <Bike className="h-5 w-5" aria-hidden="true" />
            </span>
            BikeBazar
          </Link>
          <nav className="flex items-center gap-1">
            {items.slice(1, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold",
                    isActive(pathname, item.href) ? "bg-fog text-moss" : "text-zinc-600 hover:bg-fog hover:text-ink"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href={profile ? "/profil" : "/prihlaseni"}
            className="inline-flex items-center gap-2 rounded-lg bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-ink"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            {profile ? profile.display_name : "Přihlásit"}
          </Link>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_28px_rgba(23,32,27,0.08)] backdrop-blur md:hidden">
        <div className="grid h-16 grid-cols-5">
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
