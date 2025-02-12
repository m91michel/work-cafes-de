import { CafeList } from "@/components/cafe-directory";
import { CityList } from "@/components/city/city-list";
import { CitySelector } from "@/components/city/city-selector";
import { getSEOTags } from "@/libs/seo";
import { getBestCafes, getCafesCount } from "@/libs/supabase/cafes";
import { getCities, getCitiesCount } from "@/libs/supabase/cities";
import { FAQSection } from "@/components/faq";
import { About } from "@/components/sections/About";
import initTranslations from "@/libs/i18n/config";
import { Cafe, City } from "@/libs/types";
import { TransHighlight } from "@/components/general/translation";
import { domainDe, domainEn, domainName } from "@/config/config";

export const revalidate = 5;

export async function generateMetadata() {
  const { t } = await initTranslations(['common']);
  return getSEOTags({
    title: t('meta.title'),
    description: t('meta.description'),
    canonicalUrlRelative: '/'
  });
}

interface HomeContentProps {
  cafes: Cafe[];
  cities: City[];
}

async function HomeContent({ cafes, cities }: HomeContentProps) {
  const { t } = await initTranslations(['home']);
  const cafesCount = await getCafesCount();
  const citiesCount = await getCitiesCount();
  
  const cafesButtonText = cafesCount != null
    ? t('cafes.buttonText_count', { count: cafesCount })
    : t('cafes.buttonText');

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-4"
          >
            <TransHighlight i18nKey="home:hero.title" />
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('hero.subtitle')}
          </p>
        </div>
        {cities && <CitySelector cities={cities} />}
      </div>
      <CafeList
        cafes={cafes}
        title={t('cafes.title')}
        showMoreButton={true}
        buttonText={cafesButtonText}
      />

      <CityList
        cities={cities}
        title={t('cities.title')}
        showMoreButton={true}
        buttonText={t('cities.buttonText')}
        t={t}
      />
  
      <FAQSection />

      <About cafeCount={cafesCount ?? 0} cityCount={citiesCount ?? 0} />
    </main>
  );
}

export default async function Home() {
  // const { resources } = await initTranslations(['home', 'common']);
  const cafes = await getBestCafes({ limit: 6, offset: 0 });
  const cities = await getCities({ limit: 6, offset: 0 });

  return (

      <HomeContent 
        cafes={cafes}
        cities={cities}
      />
    
  );
}
