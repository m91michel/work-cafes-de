import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env.local' }) // or just .env, depending on your env file name

import { generateSlug } from '../libs/utils';
import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey, { db: { schema: 'cafeforwork' } });

async function main() {
    const { data } = await supabase
        .from('cafes')
        .select('name, slug, city:cities(slug, name)');
    
    if (!data) {
        console.error('No cafes found');
        return;
    }

    for (const cafe of data) {
        const slug = generateSlug(`${cafe.city?.slug}-${cafe.name}`);
        console.log(`Processing ${cafe.name}`, { slug, old_slug: cafe.slug });

        const { error } = await supabase
            .from('cafes')
            .update({ slug })
            .eq('name', cafe.name || '')
            .eq('city_slug', cafe.city?.slug || '');

        if (error) {
            console.error(`Error updating slug for ${cafe.name}: ${error}`);
        }
    }
}

main().catch(console.error);
