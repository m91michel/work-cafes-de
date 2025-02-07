"use client";

// import pilot from "../assets/pilot.png";
import { useCTranslation } from "@/hooks/use-translations";
import { Statistics } from "./Statistics";
import { TransHighlight } from "../general/translation";

const aboutStats = [
  {
    quantity: "200+",
    description: "Cafes",
  },
  {
    quantity: "20+",
    description: "Städte",
  },
];

type Props = {
  cafeCount: number;
  cityCount: number;
};

export const About = ({ cafeCount, cityCount }: Props) => {
  const { t } = useCTranslation('home');
  const aboutStats = [
    {
      quantity: cafeCount,
      description: t('about.cafe_count'),
    },
    {
      quantity: cityCount,
      description: t('about.city_count'),
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
