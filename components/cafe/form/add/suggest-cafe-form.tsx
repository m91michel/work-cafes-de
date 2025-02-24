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
import { HiddenInput } from "@/components/general/form/inputs/hidden-input";
import { PlaceResult, PlacesAutocomplete } from "@/components/general/form/places-autocomplete";
import { zodResolver } from "@hookform/resolvers/zod";
import { SuggestCafeInput, suggestCafeSchema } from "./schema";
import { CountrySelectForm } from "@/components/general/form/inputs/country-select";
import { MyTextarea } from "@/components/general/form/inputs/textarea-input";

interface FormProps {
  className?: string;
}

export function SuggestCafeForm({ className }: FormProps) {
  const { t } = useCTranslation("cafe");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<SuggestCafeInput>({
    resolver: zodResolver(suggestCafeSchema),
    defaultValues: {
      name: "",
      city: "",
      address: "",
      countryCode: "",
      email: "",
      placeId: "",
      latitude: "",
      longitude: "",
      url: "",
    },
  });
  const { reset, watch } = form;
  const countryCode = watch("countryCode");

  async function clientAction(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await suggestCityAction(formData);
        if (result.success) {
          toast({
            title: t("submit.toast.success.title"),
            description: t("submit.toast.success.description"),
          });
          reset();
        } else {
          toast({
            title: t("submit.toast.error.title"),
            description: result.error || t("submit.toast.error.description"),
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: t("submit.toast.error.title"),
          description: t("submit.toast.error.description"),
          variant: "destructive",
        });
      }
    });
  }

  const setPlace = (place?: PlaceResult | null) => {
    if (!place) {
      return;
    }
    form.setValue("name", place.name);
    form.setValue("placeId", place.placeId);
    form.setValue("city", place.city);
    form.setValue("address", place.address);
    form.setValue("countryCode", place.countryCode);
    form.setValue("latitude", place.latitude.toString());
    form.setValue("longitude", place.longitude.toString());
  };

  return (
    <Form {...form}>
      <form action={clientAction} className={cn("space-y-4", className)}>
        <HiddenInput form={form} name="name" />
        <HiddenInput form={form} name="placeId" />
        <HiddenInput form={form} name="latitude" />
        <HiddenInput form={form} name="longitude" />
        <HiddenInput form={form} name="city" />
        <HiddenInput form={form} name="countryCode" />

        <CountrySelectForm
          form={form}
          name="countryCode"
          label={t("submit.form.country")}
        />
        <PlacesAutocomplete
          onPlaceSelect={setPlace}
          label={t("submit.form.name")}
          placeholder={t("submit.form.name_placeholder")}
          componentRestrictions={{
            country: countryCode ? [countryCode] : [],
          }}
          types={["cafe", "book_store", "restaurant"]}
        />
        <MyInput
          form={form}
          name="address"
          required
          label={t("submit.form.address")}
          placeholder={t("submit.form.address_placeholder")}
        />
        <MyInput
          form={form}
          name="url"
          label={t("submit.form.url")}
          placeholder={t("submit.form.url_placeholder")}
        />

        <MyTextarea
          form={form}
          name="message"
          label={t("submit.form.message")}
          placeholder={t("submit.form.message_placeholder")}
        />
        <MyInput
          form={form}
          name="email"
          type="email"
          label={t("submit.form.email")}
          placeholder={t("submit.form.email_placeholder")}
          description={t("submit.form.email_description")}
        />

        <div className="flex gap-2 justify-end">
          <FormReset disabled={isPending} />
          <FormSubmit disabled={isPending} />
        </div>
      </form>
    </Form>
  );
}
