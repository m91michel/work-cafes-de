import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSEOTags } from "@/libs/seo";
import Script from "next/script";
import { isProd, language } from "@/libs/environment";
import { Toaster } from "@/components/ui/toaster";
import TranslationProvider from "@/components/providers/i18n-provider";
import initTranslations from "@/libs/i18n/config";

const inter = Inter({ subsets: ["latin"] });

const namespaces = ["common", "cafe", "city"];

export const metadata = getSEOTags({
  title: `Cafés zum Arbeiten`,
  description: `Finde den perfekten Arbeitsplatz für deine Bedürfnisse. Entdecken Sie Orte, Einrichtungen und Bewertungen, um deinen Arbeitsalltag zu genießen.`,
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const { resources } = await initTranslations(language, namespaces, null, null);

  return (
    <html lang={language}>
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
        <TranslationProvider locale={language} namespaces={namespaces} resources={resources}>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </TranslationProvider>
      </body>
    </html>
  );
}
