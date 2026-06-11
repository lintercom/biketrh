import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { getCurrentUserProfile, getUnreadMessageCount } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: "BikeTrh MVP",
  description: "Jednoduchý marketplace pro cyklo vybavení z druhé ruky."
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { profile } = await getCurrentUserProfile();
  const unreadMessages = profile ? await getUnreadMessageCount() : 0;

  return (
    <html lang="cs">
      <body>
        <Navigation profile={profile} unreadMessages={unreadMessages} />
        <main className="mobile-safe-bottom min-h-screen md:pt-0">{children}</main>
      </body>
    </html>
  );
}
