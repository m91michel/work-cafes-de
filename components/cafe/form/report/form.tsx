"use client";

import { useForm } from "react-hook-form";
import { useCTranslation } from "@/hooks/use-translation";
import { reportCafeAction } from "./action";
import { Form } from "@/components/ui/form";
import { MyInput } from "@/components/general/form/inputs/text-input";
import { cn } from "@/libs/utils";
import { FormReset, FormSubmit } from "@/components/general/form/buttons";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiddenInput } from "@/components/general/form/inputs/hidden-input";
import { Cafe } from "@/libs/types";
import { MyTextarea } from "@/components/general/form/inputs/textarea-input";

interface FormProps {
  className?: string;
}

interface FormInputs {
  cafe_name: string;
  email: string;
  name: string;
  message: string;
  slug: string;
}

export function ReportCafeForm({ className }: FormProps) {
  const { t } = useCTranslation("cafe");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get cafe name and slug from URL params if not provided via props
  const cafeNameFromParams = searchParams.get('name');
  const cafeSlugFromParams = searchParams.get('slug');
  
  const form = useForm<FormInputs>({
    defaultValues: {
      cafe_name: cafeNameFromParams || "",
      email: "",
      name: "",
      message: "",
      slug: cafeSlugFromParams || "",
    },
  });
  const { reset } = form;

  async function clientAction(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await reportCafeAction(formData);
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
        <HiddenInput form={form} name="slug" />
        <MyInput
          form={form}
          name="cafe_name"
          value={cafeNameFromParams || ""}
          disabled={!!cafeNameFromParams}
          label={t("report.form.cafe_name")}
        />
        <MyInput
          form={form}
          name="email"
          type="email"
          required
          label={t("common:fields.email")}
          placeholder={t("common:fields.email_placeholder")}
        />
        <MyInput
          form={form}
          name="name"
          required
          label={t("common:fields.name")}
          placeholder={t("common:fields.name_placeholder")}
        />
        <MyTextarea
          form={form}
          name="message"
          required
          label={t("common:fields.message")}
          placeholder={t("common:fields.message_placeholder")}
        />

        <div className="flex gap-2 justify-end">
          <FormReset disabled={isPending} />
          <FormSubmit disabled={isPending} />
        </div>
      </form>
    </Form>
  );
}
