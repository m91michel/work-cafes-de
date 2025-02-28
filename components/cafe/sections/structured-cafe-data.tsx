import { Cafe } from "@/libs/types";
import { FC } from "react";
import { directionLink } from "@/libs/google-maps";
import Paths from "@/libs/paths";

interface Props {
  cafe: Cafe;
}

export const StructuredCafeData: FC<Props> = ({ cafe }) => {
  if (!cafe) return null;

  // Extract rating information
  const hasRating = !!cafe.google_rating && cafe.google_rating > 0;
  const ratingValue = hasRating ? cafe.google_rating : undefined;
  const ratingCount = hasRating ? 1 : 0; // Default to 1 if we have a rating

  // Get content objects
  const aboutContent = cafe.about_content as { en?: string; de?: string } | null | undefined;
  const foodContent = cafe.food_contents as { en?: string; de?: string } | null | undefined;
  const drinksContent = cafe.drinks_content as { en?: string; de?: string } | null | undefined;
  const workFriendlyContent = cafe.work_friendly_content as { en?: string; de?: string } | null | undefined;

  // Build description from available content
  const description = [
    aboutContent?.en || '',
    workFriendlyContent?.en !== 'NO_INFO' ? workFriendlyContent?.en : '',
  ].filter(Boolean).join(' ');

  // Build the structured data object
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cafe.name,
    description: description || `A work-friendly cafe in ${cafe.city}`,
    image: cafe.preview_image || [],
    url: `${process.env.NEXT_PUBLIC_SITE_URL}${Paths.cafe(cafe.slug || '')}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: cafe.address,
      addressLocality: cafe.city,
      addressCountry: cafe.cities?.country || undefined,
    },
    openingHours: cafe.open_hours ? cafe.open_hours.split('\n') : undefined,
    ...(hasRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue,
        ratingCount,
        bestRating: 5,
        worstRating: 1,
      }
    }),
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "WiFi",
        value: cafe.wifi_qualitity ? "true" : "false",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Work Friendly",
        value: "true",
      }
    ],
    // Include menu offerings if available
    ...(foodContent?.en && foodContent.en !== 'NO_INFO' && {
      servesCuisine: "Cafe Food",
      menu: foodContent.en,
    }),
    // Add links as sameAs for search engines
    sameAs: getLinks(cafe),
  };

  // Remove undefined properties
  const cleanData = JSON.stringify(structuredData, (_, value) => {
    return value === undefined ? undefined : value;
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: cleanData }}
    />
  );
};

// Helper function to extract links from cafe
function getLinks(cafe: Cafe): string[] {
  const links: string[] = [];
  
  // Extract website links
  const linksObject = cafe.links as Record<string, string> | null | undefined;
  
  if (linksObject) {
    Object.values(linksObject).forEach(link => {
      if (typeof link === 'string' && link.startsWith('http')) {
        links.push(link);
      }
    });
  }
  
  // Add Google Maps link if available
  if (cafe.google_place_id) {
    links.push(directionLink(cafe.name, cafe.google_place_id));
  }
  
  return links;
} 