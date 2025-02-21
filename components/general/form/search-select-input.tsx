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

type Size = ButtonProps["size"]

interface CityProps {
  options: {
    value: string
    label: string
  }[]
  className?: string
  label?: string
  placeholder?: string
  size?: Size
  onChange?: (value: string) => void
}

export function SearchSelectInput({ options, className, label, placeholder, size, onChange }: CityProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [width, setWidth] = React.useState<number>(0)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (buttonRef.current) {
      setWidth(buttonRef.current.offsetWidth)
    }
  }, [open])

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
          aria-label={label}
          size={size}
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {value
            ? options.find((option) => option.value.includes(value))?.label
            : label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: width ? `${width}px` : 'auto' }}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={onSelect}
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
