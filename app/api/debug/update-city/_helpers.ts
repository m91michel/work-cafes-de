import supabase from "@/libs/supabase/supabaseClient"
import { City } from "@/libs/types"
import { generateSlug } from "@/libs/utils"
import { Cafe } from "@/libs/types"

export async function generateSlugForCafe(cafe: Cafe, cities: City[]) {
    const city_slug = cities?.find(city => city.name === mapTranslatedCities(cafe.city))?.slug
    if (!city_slug) {
      console.log(`City not found for cafe: ${cafe.name} ${cafe.city}`)
      return
    }
    const cafe_slug = generateSlug(`${city_slug}-${cafe.name}`)

    const { error } = await supabase.from("cafes").update({ 
        slug: cafe_slug,
        city_slug: city_slug
    }).eq("id", cafe.id)

    if (error) {
      console.log(`Error updating cafe: ${cafe.name}`, error)
    }
}

export function mapTranslatedCities(cityName?: string | null) {
    if (!cityName) {
        return null
    }

    if (cityName === "Cologne") {
        return "Köln"
    }

    if (cityName === "Munich") {
        return "München"
    }

    return cityName
}

const storageUrl = "https://arbeits-cafe.b-cdn.net"
export async function updateImageUrl(cafe: Cafe) {
  if (!cafe.preview_image) {
    console.log(`No preview image for ${cafe.name}`)
    return
  }
  if (!cafe.preview_image.includes(storageUrl)) {
    console.log(`Preview image not from bunny for ${cafe.name}`)
    await supabase.from("cafes").update({ 
      processed_at: new Date().toISOString(),
      processed: {
        broken_image: false,
      }
    }).eq("id", cafe.id);
    return
  }
  // const filename = `${cafe.slug}-thumb.jpg`;
  // const bunnyUrl = await uploadImagesToBunny(cafe.preview_image, filename, 'cafes');
  const newImageUrl = cafe.preview_image.replace(storageUrl, `${storageUrl}/cafes`)
  await supabase.from("cafes").update({ 
    preview_image: newImageUrl, 
    processed_at: new Date().toISOString(),
    processed: {
      broken_image: false,
    }
  }).eq("id", cafe.id);
}