"use client";

// import pilot from "../assets/pilot.png";
import { useCTranslation } from "@/hooks/use-translation";
import { Statistics } from "./Statistics";
import { TransHighlight } from "../translation";

type Props = {
  cafeCount?: number | null;
  cityCount?: number | null;
  countryCount?: number | null;
};

export const About = ({ cafeCount = 0, cityCount = 0, countryCount = 0 }: Props) => {
  const { t } = useCTranslation('home');
  const aboutStats = [
    {
      quantity: cafeCount ?? 0,
      description: t('about.cafe_count'),
    },
    {
      quantity: cityCount ?? 0,
      description: t('about.city_count'),
    },
    {
      quantity: countryCount ?? 0,
      description: t('about.country_count'),
    },
  ];
  return (
    <section id="about" className="max-w-7xl mx-auto py-24 sm:py-32 px-4">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-12 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          {/* Images goes here */}
          <div className="w-full md:w-1/3">
            <Statistics stats={aboutStats} />
          </div>

          <div className="bg-green-0 flex flex-col justify-between w-full md:w-2/3">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <TransHighlight i18nKey="about.title" namespace="home" />
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                {t('about.description')}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
