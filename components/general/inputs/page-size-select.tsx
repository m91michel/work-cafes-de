'use client';

import { BaseFilterSelect } from '@/components/general/inputs/base-filter-select';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { useQueryState, parseAsString } from 'nuqs';

type Props = {
  options: number[];
  defaultValue?: number;
  className?: string;
};

export function PageSizeSelect({ options, defaultValue = 24, className }: Props) {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const [, setPage] = useQueryState('page', parseAsString.withOptions({ scroll: true, shallow: false }));
  const [, setPageSize] = useQueryState('page_size', parseAsString.withOptions({ shallow: false }));
  const currentPageSize = Number(searchParams.get('page_size')) || defaultValue;

  const selectOptions = options.map((option) => ({
    value: option.toString(),
    label: `${option} Cafés`,
  }));

  const handlePageSizeChange = async (newValue: string) => {
    // Update both parameters in sequence
    await setPage('1');
    await setPageSize(newValue === defaultValue.toString() ? null : newValue);
  };

  return (
    <div className={className}>
      <BaseFilterSelect
        paramKey="page_size"
        options={selectOptions}
        placeholder={currentPageSize.toString()}
        defaultValue={currentPageSize.toString()}
        onValueChange={handlePageSizeChange}
        aria-label={t('pagination.select_page_size')}
      />
    </div>
  );
} 