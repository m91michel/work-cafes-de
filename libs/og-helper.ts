import { baseUrl } from "@/config/config";
import { Cafe, City } from "./types";
import { isGerman } from "./environment";

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

export function getCityOGImage(city?: City | null) {
    const ogImageUrl = new URL('/api/og/city', baseUrl).toString();
    const searchParams = new URLSearchParams();

    // TODO: Add better fallback
    const name = isGerman ? city?.name_de : city?.name_en;
    if (name) searchParams.set('name', name);
    if (city?.country) searchParams.set('country', city.country);
    if (city?.preview_image) searchParams.set('image', city.preview_image);

    const ogImage = `${ogImageUrl}?${searchParams.toString()}`;

    return ogImage;
}
