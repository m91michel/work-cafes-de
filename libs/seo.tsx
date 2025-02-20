import type { Metadata } from "next";

import { locale, localhost } from "./environment";
import config, { baseUrl, domainDe, domainEn, domainName } from "@/config/config";

// These are all the SEO tags you can add to your pages.
// It prefills data with default title/description/OG, etc.. and you can cusotmize it for each page.
// It's already added in the root layout.js so you don't have to add it to every pages
// But I recommend to set the canonical URL for each page (export const metadata = getSEOTags({canonicalUrlRelative: "/"});)
// See https://shipfa.st/docs/features/seo
export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
  ...metadata
}: Metadata & {
  canonicalUrlRelative?: string;
  extraTags?: Record<string, any>;
} = {}) => {
  const _title = title || config.appName
  const _description = description || config.appDescription
  return {
    // between 10 and 70 characters (what does your app do for the user?) > your main should be here
    title: _title,
    // between 100 and 320 characters (how does your app help the user?)
    description: _description,
    // some keywords separated by commas. by default it will be your app name
    keywords: keywords || [config.appName],
    applicationName: config.appName,
    // set a base URL prefix for other fields that require a fully qualified URL (.e.g og:image: og:image: 'https://yourdomain.com/share.png' => '/share.png')
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? localhost
        : baseUrl
    ),

    openGraph: {
      title: openGraph?.title || _title,
      description: openGraph?.description || _description,
      url: openGraph?.url || canonicalUrlRelative || baseUrl,
      siteName: openGraph?.title || _title,
      // If you add an opengraph-image.(jpg|jpeg|png|gif) image to the /app folder, you don't need the code below
      // images: [
      //   {
      //     url: `https://${config.domainName}/share.png`,
      //     width: 1200,
      //     height: 660,
      //   },
      // ],
      locale: locale,
      type: "website",
      ...openGraph,
    },

    twitter: {
      title: openGraph?.title || _title,
      description: openGraph?.description || _description,
      // If you add an twitter-image.(jpg|jpeg|png|gif) image to the /app folder, you don't need the code below
      // images: [openGraph?.image || defaults.og.image],
      card: "summary_large_image",
      creator: "@m91michel",
    },

    // If a canonical URL is given, we add it. The metadataBase will turn the relative URL into a fully qualified URL
    ...(canonicalUrlRelative && {
      alternates: {
        canonical: canonicalUrlRelative,
        languages: {
          "de": `https://${domainDe}${canonicalUrlRelative}`,
          "en": `https://${domainEn}${canonicalUrlRelative}`,
          "x-default": `https://${domainName}${canonicalUrlRelative}`,
        },
      },
    }),

    ...metadata,

    // If you want to add extra tags, you can pass them here
    ...extraTags,
  };
};

// Strctured Data for Rich Results on Google. Learn more: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
// Find your type here (SoftwareApp, Book...): https://developers.google.com/search/docs/appearance/structured-data/search-gallery
// Use this tool to check data is well structure: https://search.google.com/test/rich-results
// You don't have to use this component, but it increase your chances of having a rich snippet on Google.
// I recommend this one below to your /page.js for software apps: It tells Google your AppName is a Software, and it has a rating of 4.8/5 from 12 reviews.
// Fill the fields with your own data
// See https://shipfa.st/docs/features/seo
export const renderSchemaTags = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Organization",
            name: config.appName,
            description: config.appDescription,
            url: `https://${config.domainName}/`,
            logo: `https://${config.domainName}/logo.png`,
            sameAs: [
              "https://twitter.com/m91michel",
              // Add other social profiles here
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Munich", // Update with your location
              addressCountry: "DE"
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebSite",
            name: config.appName,
            url: `https://${config.domainName}/`,
            potentialAction: {
              "@type": "SearchAction",
              target: `https://${config.domainName}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          }),
        }}
      />
    </>
  );
};

// Add this new function for individual cafe pages
export const renderCafeSchema = (cafe: {
  name: string;
  address: string;
  city: string;
  geo: { latitude: number; longitude: number };
  rating: number;
  reviewCount: number;
  openingHours: string;
  phone: string;
}) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "http://schema.org",
          "@type": "CafeOrCoffeeShop",
          name: cafe.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: cafe.address,
            addressLocality: cafe.city,
            addressCountry: "DE"
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: cafe.geo.latitude,
            longitude: cafe.geo.longitude
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: cafe.rating,
            reviewCount: cafe.reviewCount
          },
          openingHours: cafe.openingHours,
          telephone: cafe.phone,
          image: `https://${config.domainName}/images/cafes/${cafe.name.toLowerCase().replace(/ /g, '-')}.jpg`
        })
      }}
    />
  );
};
