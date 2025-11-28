import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { input } from '@inquirer/prompts';
import { updateCafeCount } from '../../libs/supabase/cities';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey, { db: { schema: 'cafeforwork' } });

export async function publishCafes() {
    const citySlug = await input({
        message: 'Enter the city slug',
    })

    const { data } = await supabase
        .from('cafes')
        .select('name, slug')
        .eq('status', 'PROCESSED')
        .eq('city_slug', citySlug);
    
    if (!data || data?.length === 0) {
        console.error('No cafes found');
        return;
    }
    console.log(`⚡️ Processing ${data.length} cafes`);

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

    await updateCafeCount({ slug: citySlug || undefined, status: 'PROCESSING' });

    console.log(`✅ Published ${data.length} cafes`);
}