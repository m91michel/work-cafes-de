'use client';

import { City } from '@/libs/types';
import { BaseFilterSelect } from './base-filter-select';
import { useCTranslation } from '@/hooks/use-translation';
import { isGerman } from '@/libs/environment';


type CityFilterProps = {
  cities: City[];
};

export function CityFilter({ cities }: CityFilterProps) {
  const { t } = useCTranslation('cafe');

  const cityOptions = cities.map((city) => {
    const label = isGerman ? city.name_de : city.name_en;
    return {
      value: city.slug,
      label: label || city.slug,
    };
  });

  return (
    <BaseFilterSelect
      paramKey="city"
      options={cityOptions}
      placeholder={t('filters.select_city')}
    />
  );
} 