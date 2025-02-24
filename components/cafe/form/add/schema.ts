import { z } from "zod";

export const suggestCafeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  countryCode: z
    .string()
    .length(2, "Country code must be 2 characters"),
  email: z
    .string()
    .transform((e) => (e === "" ? undefined : e))
    .pipe(z.string().email("Invalid email address").optional()),
  message: z.string().optional(),
  placeId: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  url: z.string()
    .transform((e) => (e === "" ? undefined : e))
    .pipe(z.string().url("Invalid URL").optional()),
});

export type SuggestCafeInput = z.infer<typeof suggestCafeSchema>;
