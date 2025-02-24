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
import { PlaceResult, PlacesAutocomplete } from "@/components/general/form/places-autocomplete";
import { zodResolver } from "@hookform/resolvers/zod";
import { SuggestCityInput, suggestCitySchema } from "./schema";


interface FormProps {
  className?: string;
}

export function AddCityForm({ className }: FormProps) {
  const { t } = useCTranslation("city");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<SuggestCityInput>({
    resolver: zodResolver(suggestCitySchema),
    defaultValues: {
      city: "",
      country: "",
      state: "",
      email: "",
      placeId: "",
      latitude: "",
      longitude: "",
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

  const setPlace = (place?: PlaceResult | null) => {
    if (!place) {
      return;
    }
    form.setValue("placeId", place.placeId);
    form.setValue("city", place.city);
    form.setValue("state", place.state);
    form.setValue("country", place.countryCode);
    form.setValue("latitude", place.latitude.toString());
    form.setValue("longitude", place.longitude.toString());
  };
  
  return (
    <Form {...form}>
      <form action={clientAction} className={cn("space-y-4", className)}>
        <HiddenInput form={form} name="placeId" />
        <HiddenInput form={form} name="latitude" />
        <HiddenInput form={form} name="longitude" />
        <HiddenInput form={form} name="city" />

        <PlacesAutocomplete
          onPlaceSelect={setPlace}
          label={t("suggest.form.city")}
          placeholder={t("suggest.form.city_placeholder")}
          types={["(cities)"]}
        />
        <MyInput
          form={form}
          name="state"
          required
          label={t("suggest.form.state")}
          placeholder={t("suggest.form.state_placeholder")}
        />
        <HiddenInput form={form} name="country" />
        <CountrySelectForm
          form={form}
          name="country"
          label={t("suggest.form.country")}
        />
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
