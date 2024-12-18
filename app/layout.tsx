import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSEOTags } from "@/libs/seo";
import Script from "next/script";
import { isProd } from "@/libs/environment";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = getSEOTags({
  title: `Cafés zum Arbeiten`,
  description: `Finde den perfekten Arbeitsplatz für deine Bedürfnisse. Entdecken Sie Orte, Einrichtungen und Bewertungen, um deinen Arbeitsalltag zu genießen.`,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      {isProd && (
        <>
          <Script
            defer
            src="/stats/script.js"
            data-website-id="51113768-3569-4f28-94d3-0104fac43fcf"
            data-domains="cafezumarbeiten.de"
          />
        </>
      )}
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
