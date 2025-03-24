'use client';

import { useQueryState } from 'next-usequerystate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


interface FilterOption {
  value: string;
  label: string;
}

interface BaseFilterSelectProps {
  paramKey: string;
  options: FilterOption[];
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  onValueChange?: (value: string, setValue: (value: string | null) => Promise<URLSearchParams>) => Promise<void>;
}

export function BaseFilterSelect({
  paramKey,
  options,
  placeholder,
  className = "",
  defaultValue,
  onValueChange,
}: BaseFilterSelectProps) {
  const [value, setValue] = useQueryState(paramKey, {
    defaultValue: defaultValue || '',
    shallow: false,
  });

  const handleValueChange = async (newValue: string) => {
    if (onValueChange) {
      // Let the parent component handle the URL updates
      await onValueChange(newValue, setValue);
    } else {
      // Default behavior if no onValueChange provided
      await setValue(newValue === defaultValue ? null : newValue);
    }
  };

  return (
    <div className={className}>
      <Select
        value={value || defaultValue}
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
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