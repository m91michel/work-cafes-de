import { Cafe, CityData } from './types';

export async function getCafes(): Promise<CityData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/cafes`);
  return response.json();
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