import supabase from './supabaseClient';

export async function getCafes(): Promise<any[] | null> {
  const { data, error } = await supabase
    .from("cafes")
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
    return null;
  }

  return data;
}