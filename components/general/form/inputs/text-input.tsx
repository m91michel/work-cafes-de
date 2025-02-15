"use client";

import { Input, InputProps as InputPropsUI } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MyFormItem } from "../form-item";

interface InputProps extends Omit<InputPropsUI, "form"> {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
}

export function MyInput({
  form,
  name,
  label,
  placeholder,
  description,
  ...otherProps
}: InputProps) {
  return (
    <MyFormItem
      form={form}
      name={name}
      label={label}
      description={description}
      render={(props) => (
        <Input placeholder={placeholder} {...otherProps} {...props} />
      )}
    />
  );
}
