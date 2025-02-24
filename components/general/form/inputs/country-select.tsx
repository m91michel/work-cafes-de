"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchSelectInput } from "../search-select-input";
import countries from "@/config/countires";
import { MyFormItem } from "../form-item";
import { useCTranslation } from "@/hooks/use-translation";

const options = countries.map((country) => ({
  value: country.code,
  label: `${country.flag} ${country.name}`,
  keywords: [country.code, country.name, country.flag].filter(Boolean) as string[],
}));

type InputProps = {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
};
export function CountrySelectForm({ form, name, label, description, placeholder }: InputProps) {
  const { t } = useCTranslation("common");
  
  return (
    <MyFormItem
      form={form}
      name={name}
      label={label}
      description={description}
      render={(field) => (
        <SearchSelectInput
          options={options}
          value={field.value}
          placeholder={placeholder ?? `${t("common:actions.search")}...`}
          onChange={(value) => form.setValue(name, value)}
          className={cn("w-full text-muted-foreground")}
        />
      )}
    />
  );
}
