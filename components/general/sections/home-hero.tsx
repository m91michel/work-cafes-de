import { Coffee, Wifi, Users, ChevronDown } from "lucide-react";
import { TransHighlight } from "../translation";
import { CitySearchSelector } from "@/components/city/city-selector";
import { getAllCities } from "@/libs/supabase/cities";
import { NumberTicker } from "../magicui/NumberTicker";
import { getReviewsCount } from "@/libs/supabase/reviews";
import { getCafesCount } from "@/libs/supabase/cafes";

export default async function Hero() {
  const cities = await getAllCities();
  const reviewsCount = await getReviewsCount();
  const cafesCount = await getCafesCount();

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Animated background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF3E0] via-white to-[#FFE0B2] opacity-80 dark:from-[#2C1810] dark:via-background dark:to-[#1F1007]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>
      {/* Animated background pattern */}
      <div className="absolute inset-0 -z-10">
        {/* Dot pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF3E0] via-white to-[#FFE0B2] opacity-80 dark:from-[#2C1810] dark:via-background dark:to-[#1F1007] animate-gradient" />

        {/* Animated glow effect */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px] animate-pulse-slow" />
      </div>

      <div className="container relative z-20 mx-auto px-4 pt-20 md:pt-32">
        {/* Floating icons */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 transform md:left-[20%] hidden md:block">
          <div className="animate-float-slow relative h-12 w-12 rounded-2xl bg-primary/10 p-3 backdrop-blur-sm">
            <Coffee className="h-full w-full text-primary" />
          </div>
        </div>
        <div className="absolute right-[20%] top-12 xl:top-32 hidden animate-float md:block">
          <div className="relative h-10 w-10 rounded-2xl bg-primary/10 p-2 backdrop-blur-sm">
            <Wifi className="h-full w-full text-primary" />
          </div>
        </div>
        <div className="absolute left-[10%] xl:left-[20%] top-52 lg:top-40 hidden animate-float-slow md:block">
          <div className="relative h-10 w-10 rounded-2xl bg-primary/10 p-2 backdrop-blur-sm">
            <Users className="h-full w-full text-primary" />
          </div>
        </div>

        <div className="mx-auto max-w-[800px] text-center mb-12">
          <h1 className="animate-fade-up text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <TransHighlight i18nKey="home:hero.title" />
          </h1>
          <p className="animate-fade-up text-muted-foreground/80 animation-delay-100 mt-6 text-lg md:text-xl">
            <TransHighlight i18nKey="home:hero.subtitle" />
          </p>

          {/* Search */}
          <div className="animate-fade-up animation-delay-300 mt-12 flex flex-col items-center gap-4">
            <CitySearchSelector
              cities={cities}
              className="h-[56px] w-full max-w-[400px] text-lg"
            />
            {/* <Button size="lg" className="h-[56px] px-8 text-lg">
              Find Cafes
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button> */}
          </div>

          {/* Stats */}
          <div className="animate-fade-up animation-delay-200 mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-primary/5 p-4">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                <NumberTicker
                  value={cafesCount ?? 0}
                  className="text-primary"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <TransHighlight i18nKey="home:hero.stats.cafes" />
              </div>
            </div>
            <div className="rounded-lg bg-primary/5 p-4">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                <NumberTicker value={cities.length} className="text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">
                <TransHighlight i18nKey="home:hero.stats.cities" />
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 rounded-lg bg-primary/5 p-4">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                <NumberTicker value={reviewsCount} className="text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">
                <TransHighlight i18nKey="home:hero.stats.reviews" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
