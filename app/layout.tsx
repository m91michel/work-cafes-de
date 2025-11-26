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
import config from "@/config/config";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  // Ensure font is downloaded during build, not runtime
  preload: true,
});

const namespaces = ["common", "cafe", "city", "home", "study"];

export const metadata = getSEOTags({
  title: `Cafés zum Arbeiten`,
  description: `Finde den perfekten Arbeitsplatz für deine Bedürfnisse. Entdecken Sie Orte, Einrichtungen und Bewertungen, um deinen Arbeitsalltag zu genießen.`,
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const { resources } = await initTranslations(namespaces, language, null, null);

  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      {isProd && (
        <>
          <Script
            defer
            src="/stats/script.js"
            data-website-id={config.umami.id}
            data-domains={config.umami.domain}
          />
        </>
      )}
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NuqsAdapter>
          <TranslationProvider
            locale={language}
            namespaces={namespaces}
            resources={resources}
          >
            <Header />
            {children}
            <Footer />
            <Toaster />
          </TranslationProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
