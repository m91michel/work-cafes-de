import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

import fs from 'fs';
import csv from 'csv-parser';
import { City } from '@/libs/types';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types_db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey, { db: { schema: 'cafeforwork' } });

async function upsertCities() {
    const cities: City[] = [];

    // Read and parse the CSV file
    fs.createReadStream('../data/cities.csv')
        .pipe(csv())
        .on('data', (row) => {
            cities.push({
                ...row,
                population: row.population ? parseInt(row.population) : null,
            });
        })
        .on('end', async () => {
            console.log('CSV file successfully processed');
            
            // Upsert cities into the Supabase database
            const { data, error } = await supabase
                .from('cities')
                // @ts-ignore
                .upsert(cities, { onConflict: ['slug'], ignoreDuplicates: false })
                .select('name');

            if (error) {
                console.error('Error upserting cities:', error);
            } else {
                console.log('Cities upserted successfully:', data);
            }
        });
}

upsertCities().catch(console.error); 