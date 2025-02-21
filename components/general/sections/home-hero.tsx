import { getAllCities } from "@/libs/supabase/cities";
import { TransHighlight } from "../translation";
import { CitySearchSelector } from "@/components/city/city-selector";

export default async function HomeHero() {
  const cities = await getAllCities();

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <TransHighlight i18nKey="home:hero.title" />
        </h1>
        <p className="text-xl text-muted-foreground">
          {<TransHighlight i18nKey="home:hero.subtitle" />}
        </p>
      </div>
      <div className="text-center">
        <CitySearchSelector cities={cities} />
      </div>
    </div>
  );
}
