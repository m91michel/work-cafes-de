"use client";

import {
  Textarea,
  TextareaProps as TextareaPropsUI,
} from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MyFormItem } from "../form-item";

interface TextareaProps extends Omit<TextareaPropsUI, "form"> {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
}

export function MyTextarea({
  form,
  name,
  label,
  placeholder,
  description,
  ...otherProps
}: TextareaProps) {
  return (
    <MyFormItem
      form={form}
      name={name}
      label={label}
      description={description}
      render={(props) => (
        <Textarea placeholder={placeholder} {...otherProps} {...props} />
      )}
    />
  );
}
