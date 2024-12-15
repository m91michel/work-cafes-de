import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types_db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey, { db: { schema: 'cafeforwork' } });

export async function updateCafeCount() {
    const { data } = await supabase.from('cities').select('name, slug');
    console.log(data);

    if (!data) {
        console.error('No cities found');
        return;
    }

    for (const city of data) {
        const { count = 0 } = await supabase
        .from('cafes')
        .select('name, slug, city_slug', { count: 'exact' })
        .eq('city_slug', city.slug)

        console.log(`Updating ${city.name} with ${count} cafes`);
        await supabase.from('cities').update({ cafes_count: count }).eq('slug', city.slug);
    }

    console.log(`Cafes count updated successfully for ${data.length} cities`);
}

updateCafeCount().catch(console.error); 