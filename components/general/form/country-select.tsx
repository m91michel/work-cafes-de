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
import countries from "@/config/countires";
import { MyFormItem } from "./form-item";

const options = countries.map((country) => ({
  value: country.code,
  label: `${country.flag} ${country.name}`,
}));

type InputProps = {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: string;
};
export function CountrySelectForm({ form, name, label, description }: InputProps) {
  return (
    <MyFormItem
      form={form}
      name={name}
      label={label}
      description={description}
      render={(field) => (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value
                  ? options.find((country) => country.value === field.value)
                      ?.label
                  : "Select country"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-full min-w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {options.map((country) => (
                    <CommandItem
                      value={country.label}
                      key={country.value}
                      onSelect={() => {
                        form.setValue("country", country.value);
                      }}
                    >
                      {country.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          country.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
