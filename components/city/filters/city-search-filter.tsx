'use client';

import { Input } from '@/components/ui/input';
import { useCTranslation } from '@/hooks/use-translation';
import { useQueryState } from 'next-usequerystate';
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

interface Props {
  className?: string;
}

export function CitySearchFilter({ className }: Props) {
  const { t } = useCTranslation('city');
  const [query, setQuery] = useQueryState("q");

  // Create a debounced version of setQuery
  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setQuery(value), 400),
    [setQuery]
  );

  return (
    <Input
      className={className}
      placeholder={t('filters.search_placeholder')}
      defaultValue={query || ""}
      onChange={(e) => debouncedSetQuery(e.target.value)}
    />
  );
} 