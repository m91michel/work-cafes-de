"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ControllerRenderProps } from "react-hook-form";

type FormItemProps = {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: string;
  render: (field: ControllerRenderProps<any>) => React.ReactElement;
};

export function MyFormItem({
  form,
  name,
  label,
  description,
  render,
}: FormItemProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>{render({ ...field })}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
