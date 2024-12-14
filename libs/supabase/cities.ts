import { City } from '../types';
import supabase from './supabaseClient';

type GetCafeProps = {
    limit?: number
    offset?: number
    excludeSlug?: string;
}
export async function getCities(props: GetCafeProps = { limit: 100, offset: 0 }): Promise<City[]> {
  const { limit = 100, offset = 0, excludeSlug } = props;

  const { data, error } = await supabase
    .from("cities")
    .select('*')
    .range(offset, offset + limit - 1)
    .neq('slug', excludeSlug)
    .gte('cafes_count', 1)
    .order('population', { ascending: false });

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