"use client";

import { useForm } from "react-hook-form";
import { useCTranslation } from "@/hooks/use-translation";
import { suggestCityAction } from "./action";
import { Form } from "@/components/ui/form";
import { MyInput } from "@/components/general/form/inputs/text-input";
import { cn } from "@/libs/utils";
import { FormReset, FormSubmit } from "@/components/general/form/buttons";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CountrySelectForm } from "@/components/general/form/country-select";
import { HiddenInput } from "@/components/general/form/inputs/hidden-input";

interface FormProps {
  className?: string;
}

interface FormInputs {
  city: string;
  country: string;
  state: string;
  email: string;
}

export function SuggestCafeForm({ className }: FormProps) {
  const { t } = useCTranslation("cafe");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<FormInputs>({
    defaultValues: {
      city: "",
      country: "",
      state: "",
      email: "",
    },
  });
  const { reset } = form;

  async function clientAction(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await suggestCityAction(formData);
        if (result.success) {
          toast({
            title: t("suggest.toast.success.title"),
            description: t("suggest.toast.success.description"),
          });
          reset();
          router.refresh();
        } else {
          toast({
            title: t("suggest.toast.error.title"),
            description: result.error || t("suggest.toast.error.description"),
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: t("suggest.toast.error.title"),
          description: t("suggest.toast.error.description"),
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form action={clientAction} className={cn("space-y-4", className)}>
        <MyInput
          form={form}
          name="name"
          required
          label={t("suggest.form.name")}
          placeholder={t("suggest.form.name_placeholder")}
        />
        <MyInput
          form={form}
          name="address"
          required
          label={t("suggest.form.address")}
          placeholder={t("suggest.form.address_placeholder")}
        />
        <HiddenInput form={form} name="country" />
        <MyInput
          form={form}
          name="email"
          type="email"
          label={t("suggest.form.email")}
          placeholder={t("suggest.form.email_placeholder")}
          description={t("suggest.form.email_description")}
        />

        <div className="flex gap-2 justify-end">
          <FormReset disabled={isPending} />
          <FormSubmit disabled={isPending} />
        </div>
      </form>
    </Form>
  );
}
