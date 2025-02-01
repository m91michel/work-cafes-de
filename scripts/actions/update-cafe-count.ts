import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types_db';
import { updateCafeCount } from '../../libs/supabase/cities';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey, { db: { schema: 'cafeforwork' } });

export async function updateCountForCities() {
    const { data } = await supabase.from('cities').select('name, slug');

    if (!data) {
        console.error('No cities found');
        return;
    }

    for (const city of data) {
        await updateCafeCount(city.slug);
    }

    console.log(`Cafes count updated successfully for ${data.length} cities`);
}