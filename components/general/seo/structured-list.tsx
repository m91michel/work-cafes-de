import Paths from "@/libs/paths";
import { Cafe } from "@/libs/types";

type StructuredListProps = {
  name: string;
  description: string;
  cafes: Cafe[];
};

export const StructuredCafeList = (props: StructuredListProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: generateStructuredList(props) }}
  />
);

const generateStructuredList = ({
  name,
  description,
  cafes,
}: StructuredListProps) => {
  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "ItemList",
    name,
    description,
    itemListOrder: "Descending",
    numberOfItems: cafes.length,
    itemListElement: cafes.map((cafe, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CafeOrCoffeeShop",
        name: cafe.name,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${Paths.cafe(
          cafe.slug ?? ""
        )}`,
        image: cafe.preview_image,
        address: {
          "@type": "PostalAddress",
          streetAddress: cafe.address,
          addressLocality: cafe.city,
          postalCode: cafe.address,
        },
        amenityFeature: [
          {
            "@type": "LocationFeatureSpecification",
            name: "Free WiFi",
            value: cafe.wifi_qualitity?.toString(),
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Ambiance",
            value: cafe.ambiance?.toString(),
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Work-Friendly",
            value: "true",
          },
        ],
      },
    })),
  });
};
