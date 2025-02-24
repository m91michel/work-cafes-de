import { z } from "zod"

export const suggestCitySchema = z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string()
      .min(2, "Country is required")
      .max(2, "Country must be 2 characters"),
    email: z.string()
        .transform(e => e === "" ? undefined : e)
        .pipe(
          z.string().email("Invalid email address").optional()
        ),
    placeId: z.string().min(1, "Place ID is required"),
    latitude: z.string().min(1, "Latitude is required"),
    longitude: z.string().min(1, "Longitude is required"),
  })
  
  export type SuggestCityInput = z.infer<typeof suggestCitySchema>