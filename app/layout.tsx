import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import { AltFooter } from "@/components/alt/alt-footer";
import { AltNavbar } from "@/components/alt/alt-navbar";
import { Providers } from "@/app/providers";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "Avero Loose Theory | The Oversized Theory",
  description:
    "Avero Loose Theory is dark luxury streetwear built around quiet silhouettes, tactile layers, and oversized discipline."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>
          <div className="min-h-screen bg-bg text-text">
            <AltNavbar />
            <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
              {children}
            </main>
            <AltFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
