'use client';

import { BaseFilterSelect } from '@/components/general/inputs/base-filter-select';
import { useCTranslation } from '@/hooks/use-translation';
import { Country } from '@/libs/types';

type CountryFilterProps = {
  countries: Country[];
};

export function CountryFilter({ countries }: CountryFilterProps) {
  const { t } = useCTranslation('city');

  const countryOptions = countries.map((country) => {
    const labelWithFlag = country.flag ? `${country.flag} ${country.name}` : country.name;
    return {
      value: country.name || "-",
      label: labelWithFlag || country.name || "-",
    };
  });

  const allOption = {
    value: 'all',
    label: t('filters.by-country.all'),
  };

  return (
    <BaseFilterSelect
      paramKey="country"
      options={[allOption, ...countryOptions]}
      defaultValue={allOption.value}
      placeholder={t('filters.select_country')}
    />
  );
} 