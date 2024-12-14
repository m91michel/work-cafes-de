import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env.local' }) // or just .env, depending on your env file name

import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';
import { Cafe } from '../libs/types';
import { generateSlug } from '../libs/utils';
import { searchInGoogleMaps } from '../libs/google-maps';
import { processOpenHours } from '../libs/openai/process-open-hours';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey, { db: { schema: 'cafeforwork' } });

async function main() {
    try {
        const cafes = await readCsv<any>('../data/new-cafes.csv');

        for (const cafe of cafes) {
            console.log(`Processing ${cafe.name} in ${cafe.city}`);

            const { data: existingCafe } = await supabase
                .from('cafes')
                .select('name, address, city, city_slug')
                .eq('name', cafe.name)
                .eq('city', cafe.city)
                .single();

            if (existingCafe) {
                console.log(`Cafe ${cafe.name} already exists in ${cafe.city}`);
                continue;
            }

            const { data: city } = await supabase
                .from('cities')
                .select('name, slug')
                .eq('name', cafe.city)
                .single();

            const citySlug = city?.slug;
            if (!citySlug) {
                console.log(`City not found for ${cafe.name} ${cafe.city}`);
                continue;
            }

            const slug = generateSlug(`${citySlug}-${cafe.name}`);
            const openHours = await processOpenHours(cafe.open_hours);
            const mapsCandidates = await searchInGoogleMaps(`${cafe.name} ${cafe.address}`);

            const placeId = mapsCandidates?.[0]?.place_id;

            const cafeEntry: Partial<Cafe> = {
                name: cafe.name,
                city_slug: citySlug,
                city: cafe.city,
                address: cafe.address,
                links: cafe.links,
                wifi_qualitity: cafe.wifi_quality,
                seating_comfort: cafe.seating_comfort,
                ambiance: cafe.ambiance,
                food_content: cafe.food_and_drinks,
                open_hours: openHours,
                slug: slug,
                google_place_id: placeId,
            }
            console.log(cafeEntry);

            const { error } = await supabase.from('cafes').insert(cafeEntry);
            if (error) {
                console.error('Error inserting cafe:', error);
            } else {
                console.log('Cafe inserted successfully:', cafe.name);
            }
        }
    } catch (error) {
        console.error('Error processing CSV file:', error);
    }
}

async function readCsv<T>(filePath: string): Promise<T[]> {
    const rows: T[] = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
            .on('data', (row) => rows.push(row))
            .on('end', () => {
                console.log('CSV file successfully processed count:', rows.length);
                resolve(rows);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

main().catch(console.error);