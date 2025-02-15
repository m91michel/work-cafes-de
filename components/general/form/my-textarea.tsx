"use client";

import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MyFormItem } from "./form-item";

type InputProps = {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
};

export function MyTextarea({ form, name, label, placeholder }: InputProps) {
  return (
    <MyFormItem
      form={form}
      name={name}
      label={label}
      render={(props) => <Textarea placeholder={placeholder} {...props} />}
    />
  );
}
