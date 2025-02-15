'use client';

import { BaseFilterSelect } from '@/components/general/inputs/base-filter-select';
import { useCTranslation } from '@/hooks/use-translation';
import { countryFlag } from '@/libs/utils';

type CountryFilterProps = {
  countries: string[];
};

export function CountryFilter({ countries }: CountryFilterProps) {
  const { t } = useCTranslation('city');

  const countryOptions = countries.map((country) => {
    const flag = countryFlag(country);
    const labelWithFlag = flag ? `${flag} ${country}` : country;
    return {
      value: country,
      label: labelWithFlag || country,
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