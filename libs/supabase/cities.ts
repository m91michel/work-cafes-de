import { Cafe, City } from '../types';
import supabase from './supabaseClient';

type GetCafeProps = {
    limit?: number
    offset?: number
}
export async function getCities({ limit = 100, offset = 0 }: GetCafeProps = { limit: 100, offset: 0 }): Promise<City[]> {
  const { data, error } = await supabase
    .from("cities")
    .select('*')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }

  return data;
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const { data, error } = await supabase
    .from("cities")
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching data:', error);
    return null;
  }

  return data;
}