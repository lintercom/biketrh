import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { getCurrentUserProfile } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: "BikeBazar MVP",
  description: "Jednoduchý marketplace pro cyklo komponenty z druhé ruky."
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { profile } = await getCurrentUserProfile();

  return (
    <html lang="cs">
      <body>
        <Navigation profile={profile} />
        <main className="mobile-safe-bottom min-h-screen md:pt-0">{children}</main>
      </body>
    </html>
  );
}
