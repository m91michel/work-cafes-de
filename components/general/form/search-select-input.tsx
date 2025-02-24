"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/libs/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCTranslation } from "@/hooks/use-translation"

type Size = ButtonProps["size"]

interface CityProps {
  options: {
    value: string
    label: string
    keywords?: string[]
  }[]
  className?: string
  label?: string
  placeholder?: string
  size?: Size
  value?: string
  onChange?: (value: string) => void
}

export function SearchSelectInput({ options, className, label, placeholder, size, value: _value, onChange }: CityProps) {
  const { t } = useCTranslation("common");
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(_value ?? "")
  const [width, setWidth] = React.useState<number>(0)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const labelText = label ?? placeholder ?? ""

  React.useEffect(() => {
    if (buttonRef.current) {
      setWidth(buttonRef.current.offsetWidth)
    }
  }, [open])

  React.useEffect(() => {
    setValue(_value ?? "")
  }, [_value])

  const onSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue)
    setOpen(false)
    onChange?.(currentValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-label={labelText}
          size={size}
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {value
            ? options.find((option) => option.value.includes(value))?.label
            : labelText}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: width ? `${width}px` : 'auto' }}>
        <Command filter={searchFilter}>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{t("errors.no_results_found")}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={onSelect}
                  keywords={option.keywords}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function searchFilter(value: string, searchKey: string, keywords?: string[]) {
  const keywordsString = keywords?.join(' ') ?? ''
  const extendValue = (value + ' ' + keywordsString).toLowerCase()
  if (extendValue.includes(searchKey.toLowerCase())) return 1
  return 0
}