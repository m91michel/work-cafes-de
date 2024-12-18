import fs from 'fs';
import csv from 'csv-parser';

export async function readCsv<T>(filePath: string): Promise<T[]> {
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