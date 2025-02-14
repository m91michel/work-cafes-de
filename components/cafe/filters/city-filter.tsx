'use client';

import { City } from '@/libs/types';
import { BaseFilterSelect } from './base-filter-select';
import { useCTranslation } from '@/hooks/use-translation';
import { isGerman } from '@/libs/environment';
import { countryFlag } from '@/libs/utils';

type CityFilterProps = {
  cities: City[];
};

export function CityFilter({ cities }: CityFilterProps) {
  const { t } = useCTranslation('cafe');

  const cityOptions = cities.map((city) => {
    const label = isGerman ? city.name_de : city.name_en;
    const flag = countryFlag(city.country);
    const labelWithFlag = flag ? `${flag} ${label}` : label;
    return {
      value: city.slug,
      label: labelWithFlag || city.slug,
    };
  });

  const allOption = {
    value: 'all',
    label: t('filters.all'),
  };

  return (
    <BaseFilterSelect
      paramKey="city"
      options={[allOption, ...cityOptions]}
      defaultValue={allOption.value}
      placeholder={t('filters.select_city')}
    />
  );
} 