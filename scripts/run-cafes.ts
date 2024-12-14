import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env.local' }) // or just .env, depending on your env file name

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey, { db: { schema: 'cafeforwork' } });

async function main() {
    const { data } = await supabase
        .from('cafes')
        .select('name, slug, city:cities(slug, name)')
        .eq('city_slug', 'munich');
    
    if (!data) {
        console.error('No cafes found');
        return;
    }

    for (const cafe of data) {
        console.log(cafe);
        console.log(`Processing ${cafe.name} in ${cafe.city}`);
    }
}

main().catch(console.error);