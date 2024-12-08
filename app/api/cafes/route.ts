import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { isDev } from '@/lib/environment';

interface Cafe {
  city: string;
  name: string;
  address: string;
  wifi_speed: string;
  power_outlets: string;
  noise_level: string;
  opening_hours: string;
  website: string;
  image_url: string;
  slug: string;
}

export const revalidate = isDev ? 5 : 3600; 

export async function GET() {
  const filePath = path.join(process.cwd(), 'data/cafes.csv');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  
  const cafes = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }).map((cafe: Omit<Cafe, 'slug'>) => ({
    ...cafe,
    slug: generateSlug(cafe.city, cafe.name)
  }));

  // Group by city
  const cityData = cafes.reduce((acc: Record<string, Cafe[]>, cafe: Cafe) => {
    if (!acc[cafe.city]) {
      acc[cafe.city] = [];
    }
    acc[cafe.city].push(cafe);
    return acc;
  }, {} as Record<string, Cafe[]>);

  return NextResponse.json(cityData);
}

function generateSlug(city: string, name: string): string {
  return `${city.toLowerCase()}-${name.toLowerCase().replace(/\s+/g, '-')}`.replace(/[^a-z0-9-]/g, '');
} 