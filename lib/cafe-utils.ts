import { promises as fs } from 'fs';
import path from 'path';
import { Cafe, CityData } from './types';

export async function getCafes(): Promise<CityData> {
  const filePath = path.join(process.cwd(), 'data/cafes.csv');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  
  const rows = fileContent.split('\n').slice(1); // Skip header
  const cafes = rows.map(row => {
    const [city, name, address, wifi_speed, power_outlets, noise_level, opening_hours, website, image_url] = row.split(',');
    return {
      city,
      name,
      address,
      wifi_speed,
      power_outlets,
      noise_level,
      opening_hours,
      website,
      image_url,
      slug: generateSlug(city, name)
    };
  });

  // Group by city
  return cafes.reduce((acc: CityData, cafe) => {
    if (!acc[cafe.city]) {
      acc[cafe.city] = [];
    }
    acc[cafe.city].push(cafe);
    return acc;
  }, {});
}

export function generateSlug(city: string, name: string): string {
  return `${city.toLowerCase()}-${name.toLowerCase().replace(/\s+/g, '-')}`.replace(/[^a-z0-9-]/g, '');
}

export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  const cafes = await getCafes();
  for (const cityData of Object.values(cafes)) {
    const cafe = cityData.find(c => generateSlug(c.city, c.name) === slug);
    if (cafe) return cafe;
  }
  return null;
}