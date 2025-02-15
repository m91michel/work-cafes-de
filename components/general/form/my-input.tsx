"use client";

import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MyFormItem } from "./form-item";

type InputProps = {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
};

export function MyInput({ form, name, label, placeholder, description }: InputProps) {
  return (
    <MyFormItem
      form={form}
      name={name}
      label={label}
      description={description}
      render={(props) => <Input placeholder={placeholder} {...props} />}
    />
  );
}
