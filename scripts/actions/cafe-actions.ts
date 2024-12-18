import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey, { db: { schema: 'cafeforwork' } });

export async function publishCafes() {
    const { data } = await supabase
        .from('cafes')
        .select('name, slug')
        .eq('status', 'PROCESSED');
    
    if (!data) {
        console.error('No cafes found');
        return;
    }

    for (const cafe of data) {
        console.log(`Processing ${cafe.name}`, { slug: cafe.slug });

        const { error } = await supabase
            .from('cafes')
            .update({ status: 'PUBLISHED' })
            .eq('slug', cafe.slug || '');

        if (error) {
            console.error(`Error updating slug for ${cafe.name}: ${error}`);
        }
    }
}
