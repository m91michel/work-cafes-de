'use client';

import { City } from '@/libs/types';
import { useCTranslation } from '@/hooks/use-translation';
import { mapCityOption } from '@/components/city/city-selector';
import { SearchSelectInput } from '@/components/general/form/search-select-input';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';

type CityFilterProps = {
  cities: City[];
};

export function CityFilter({ cities }: CityFilterProps) {
  const { t } = useCTranslation('cafe');
  const allOption = {
    value: 'all',
    label: t('filters.all'),
  };
  const [value, setValue] = useQueryState('city', {
    defaultValue: allOption.value,
    shallow: false,
  });

  const cityOptions = useMemo(() => cities.map(mapCityOption), [cities]);

  const handleChange = (value: string) => {
    const newValue = value === allOption.value ? null : value;
    setValue(newValue);
  };



  return (
    <SearchSelectInput
      options={[allOption, ...cityOptions]}
      label={t('filters.select_city')}
      placeholder={t('filters.select_city')}
      value={value}
      onChange={handleChange}
      className="w-full md:max-w-sm"
    />
  );
} 