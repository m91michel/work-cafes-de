"use client";

import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

type InputProps = {
  form: UseFormReturn<any>;
  name: string;
};

export function HiddenInput({ form, name }: InputProps) {
  return <Input type="hidden" {...form.register(name)} />;
}
