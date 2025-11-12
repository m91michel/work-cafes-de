import { Cafe, CityData } from './types';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { generateSlug } from './utils';

export async function getListings(): Promise<CityData> {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be called on the server side');
  }

  const csvPath = path.join(process.cwd(), 'data', 'cafes.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  // Group cafes by city
  const cafesByCity: CityData = {};
  records.forEach((record: any) => {
    if (!cafesByCity[record.city]) {
      cafesByCity[record.city] = [];
    }

    cafesByCity[record.city].push({
      name: record.name,
      city: record.city,
      address: record.address,
      slug: generateSlug(`${record.city}-${record.name}`),
      preview_image: record.preview_image,
      ...record
    });
  });

  return cafesByCity;
}

export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  const cafes = await getListings();
  for (const cityData of Object.values(cafes)) {
    const cafe = cityData.find(c => generateSlug(`${c.city}-${c.name}`) === slug);
    if (cafe) return cafe;
  }
  return null;
}

export async function getCafeByCitySlug(slug: string, city: string): Promise<Cafe | null> {
  const cafes = await getListings();
  const cityData = cafes[city];
  return cityData?.find(c => generateSlug(`${c.city}-${c.name}`) === slug) || null;
}

export function getKeywords(countryCode: string) {
  const DACH_COUNTRIES = ["DE", "AT", "CH"];
  const isDACHCountry = DACH_COUNTRIES.includes(countryCode);

  return [
    "working", "wifi", "laptop", // English terms
    ...(isDACHCountry ? ["arbeiten", "wlan"] : []), // German terms
  ];
}