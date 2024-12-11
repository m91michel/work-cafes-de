import { Cafe } from '../types';
import supabase from './supabaseClient';

type GetCafeProps = {
    limit?: number
    offset?: number
}
export async function getCafes({ limit = 100, offset = 0 }: GetCafeProps = { limit: 100, offset: 0 }): Promise<Cafe[]> {
  const { data, error } = await supabase
    .from("cafes")
    .select('*')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }

  return data;
}

export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  const { data, error } = await supabase
    .from("cafes")
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching data:', error);
    return null;
  }

  // @ts-ignore
  return data;
}

export async function getCafesByCity(citySlug: string, limit = 100, offset = 0): Promise<Cafe[]> {
  const { data, error } = await supabase
    .from("cafes")
    .select('*')
    .eq('city_slug', citySlug)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }

  // @ts-ignore
  return data;
}