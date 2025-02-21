"use client";

import { Button } from "@/components/ui/button";
import { countryFlag } from "@/config/countires";
import { isGerman } from "@/libs/environment";
import Paths from "@/libs/paths";
import { City, Country } from "@/libs/types";
import { cn } from "@/libs/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchSelectInput } from "../general/form/search-select-input";

interface CitySelectorProps {
  cities: City[];
  className?: string;
}

export function CitySelector({ cities, className }: CitySelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-3 justify-center", className)}>
      {cities.map((city) => (
        <CityButton key={city.slug} city={city} />
      ))}
    </div>
  );
}

export function CityButton({ city }: { city: City }) {
  const flag = countryFlag(city.country);
  return (
    <Button variant="outline" asChild>
      <Link href={Paths.city(city.slug)}>
        {flag} {city.name_de} {city.cafes_count && `(${city.cafes_count})`}
      </Link>
    </Button>
  );
}

export function CitySelectorByCountry({
  countries,
  className,
}: {
  countries: Country[];
  className?: string;
}) {
  const filteredCountries = countries.filter(
    (country) => country.name && country.name !== null
  );
  return (
    <div className={cn("flex flex-wrap gap-3 justify-center", className)}>
      {filteredCountries.map((country) => (
        <Button key={country.code} variant="outline" asChild>
          <Link href={Paths.country(country.name as string)}>
            {country.flag} {country.name} ({country.city_count ?? 0})
          </Link>
        </Button>
      ))}
    </div>
  );
}

export function CitySearchSelector({ cities }: { cities: City[] }) {
  const router = useRouter();
  const options = cities.map((city) => {
    const flag = countryFlag(city.country);
    const name = isGerman ? city.name_de : city.name_en;
    return {
      value: city.slug,
      label: `${flag} ${name}`,
    };
  });

  const handleChange = (value: string) => {
    router.push(Paths.city(value));
  };
  return (
    <SearchSelectInput
      label={"Select a City"}
      placeholder={"Search.. "}
      onChange={handleChange}
      options={options}
      size="lg"
      className="w-full md:w-1/2 lg:w-1/3"
    />
  );
}
