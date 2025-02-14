'use client';

import { useQueryState } from 'next-usequerystate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCTranslation } from '@/hooks/use-translation';
import { useRouter } from 'next/navigation';


interface FilterOption {
  value: string;
  label: string;
}

interface BaseFilterSelectProps {
  paramKey: string;
  options: FilterOption[];
  placeholder: string;
  className?: string;
}

export function BaseFilterSelect({
  paramKey,
  options,
  placeholder,
  className = "w-48",
}: BaseFilterSelectProps) {
  const { t } = useCTranslation('cafe');
  const [value, setValue] = useQueryState(paramKey, {
    defaultValue: 'all',
    shallow: false,
  });

  const handleValueChange = (newValue: string) => {
    setValue(newValue === 'all' ? null : newValue);
    // router.refresh();
  };

  return (
    <div className={className}>
      <Select
        value={value || 'all'}
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t('filters.all')}
          </SelectItem>
          {options.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 