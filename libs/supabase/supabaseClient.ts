import { Database } from '@/types_db';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseKey, { db: { schema: 'cafeforwork' } });

export default supabase; 
