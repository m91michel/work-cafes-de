import { SimpleCafeList } from "@/components/cafe/lists/simple-cafe-list";
import { getSEOTags } from "@/libs/seo";
import { getBestCafes, getCafes } from "@/libs/supabase/cafes";
import { getCities, getCitiesCount } from "@/libs/supabase/cities";
import initTranslations from "@/libs/i18n/config";
import { CityListSection } from "@/components/city/sections/list-section";
import { FAQSection } from "@/components/general/sections/faq";
import { About } from "@/components/general/sections/About";
import { getCountries } from "@/libs/supabase/countries";
import { LinkSection } from "@/components/city/sections/link-section";
import HomeHero from "@/components/general/sections/home-hero";
import { FeaturedSection } from "@/components/city/sections/featured-section";
import peerlist from "./peerlist-launched.svg";
import Image from "next/image";
import { MLink } from "@/components/general/link";

// export const revalidate = 5; // dev
export const revalidate = 604800; // 7 days

export async function generateMetadata() {
  const { t } = await initTranslations(["common"]);
  return getSEOTags({
    title: t("meta.title"),
    description: t("meta.description"),
    canonicalUrlRelative: "/",
  });
}

export default async function Home() {
  const { t } = await initTranslations(["home"]);
  const citiesCount = await getCitiesCount();
  const { data: newCafes, total: cafesCount } = await getCafes({
    limit: 6,
    offset: 0,
    sortBy: "published_at",
    sortOrder: "desc",
  });

  const cafes = await getBestCafes({ limit: 6, offset: 0 });
  const biggestCities = await getCities({
    limit: 6,
    offset: 0,
    sortBy: "cafes_count",
    sortOrder: "desc",
  });

  const latestCities = await getCities({
    limit: 6,
    offset: 0,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const activeCountries = await getCountries({ status: "ACTIVE" });

  return (
    <main className="flex-1">
      <HomeHero cafesCount={cafesCount} />

      <div className="container mx-auto flex gap-4 flex-wrap justify-center items-center py-12">
        <MLink href="https://fazier.com/launches/a-wifi-place" noFollow>
          <Image
            src="https://fazier.com/api/v1/public/badges/embed_image.svg?launch_id=3483&badge_type=daily&theme=light"
            width={270}
            height={54}
            alt="Fazier badge"
            unoptimized
          />
        </MLink>

        <MLink href="https://peerlist.io/m4thias/project/a-wifi-place" noFollow>
          <Image
            src={peerlist.src}
            alt="Peerlist badge"
            width={221}
            height={60}
          />
        </MLink>
      </div>

      <SimpleCafeList
        cafes={cafes}
        title={t("cafes.title")}
        showMoreLink={true}
        buttonText={t("cafes.buttonText")}
      />

      <SimpleCafeList
        cafes={newCafes}
        subtitle={t("cafes.new_cafes_subtitle")}
        title={t("cafes.new_cafes_title")}
        showMoreLink={true}
        buttonText={t("cafes.buttonText")}
      />

      <CityListSection
        cities={biggestCities}
        title={t("cities.biggest_title")}
        showMoreButton={true}
        buttonText={t("cities.buttonText")}
        t={t}
      />

      <CityListSection
        cities={latestCities}
        title={t("cities.latest_title")}
        showMoreButton={true}
        buttonText={t("cities.buttonText")}
        t={t}
      />

      <FAQSection />

      <About
        cafeCount={cafesCount}
        cityCount={citiesCount}
        countryCount={activeCountries.length}
      />

      <LinkSection />
      <FeaturedSection />
    </main>
  );
}
