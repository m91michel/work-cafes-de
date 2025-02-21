import { baseUrl } from "@/config/config";
import { Cafe } from "./types";

export function getCafeOGImage(cafe: Cafe) {
    const ogImageUrl = new URL('/api/og/cafe', baseUrl).toString();
    const searchParams = new URLSearchParams();
    
    if (cafe.name) searchParams.set('name', cafe.name);
    if (cafe.city) searchParams.set('city', cafe.city);
    if (cafe.cities?.country) searchParams.set('country', cafe.cities.country);
    if (cafe.preview_image) searchParams.set('image', cafe.preview_image);
  
    const ogImage = `${ogImageUrl}?${searchParams.toString()}`;

    return ogImage;
}