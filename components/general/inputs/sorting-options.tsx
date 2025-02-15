'use client';


import { BaseFilterSelect } from '@/components/general/inputs/base-filter-select';
import { useCTranslation } from '@/hooks/use-translation';

export type SortingOption = {
  value: string;
  label?: string;
  key?: string;
};

type Props = {
  options: SortingOption[];
  namespace: string;
};

export function SortingOptions({ options, namespace }: Props) {
  const { t } = useCTranslation(namespace);

  const translatedOptions = options.map((option) => ({
    ...option,
    label: option.label || t(`filters.sorting.${option.key}`),
  }));

  return (
    <BaseFilterSelect
      paramKey="sort"
      options={translatedOptions}
      defaultValue={translatedOptions[0].value}
      placeholder={t('filters.select_sort')}
    />
  );
} 