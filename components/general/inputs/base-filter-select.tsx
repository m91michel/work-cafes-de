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
  placeholder: string;
  defaultValue?: string;
  className?: string;
}

export function BaseFilterSelect({
  paramKey,
  options,
  placeholder,
  className = "w-48",
  defaultValue,
}: BaseFilterSelectProps) {
  const [value, setValue] = useQueryState(paramKey, {
    defaultValue: defaultValue || '',
    shallow: false,
  });

  const handleValueChange = (newValue: string) => {
    setValue(newValue === defaultValue ? null : newValue);
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