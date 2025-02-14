'use client';

import { BaseFilterSelect } from './base-filter-select';
import { useCTranslation } from '@/hooks/use-translation';


export function SortingOptions() {
  const { t } = useCTranslation('cafe');

  const sortingOptions = [
    {
      value: 'google_rating-desc',
      label: t('filters.sorting.rating_desc'),
    },
    {
      value: 'google_rating-asc',
      label: t('filters.sorting.rating_asc'),
    },
    {
      value: 'created_at-desc',
      label: t('filters.sorting.created_at_desc'),
    },
    {
      value: 'created_at-asc',
      label: t('filters.sorting.created_at_asc'),
    },
  ];

  return (
    <BaseFilterSelect
      paramKey="sort"
      options={sortingOptions}
      defaultValue={sortingOptions[0].value}
      placeholder={t('filters.select_sort')}
    />
  );
} 