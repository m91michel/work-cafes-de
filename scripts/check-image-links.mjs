import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import csv from 'csv-parser';
import { stringify } from 'csv-stringify/sync';
import { fileTypeFromBuffer } from 'file-type';

const inputFilePath = path.join(process.cwd(), 'data/cafes.csv');
const outputFilePath = path.join(process.cwd(), 'data/cafes_filtered.csv');

async function checkImageUrl(url) {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const fileType = await fileTypeFromBuffer(buffer);
    return fileType && fileType.mime.startsWith('image/');
  } catch (error) {
    console.error(`Error checking URL: ${url}`, error.message);
    return false;
  }
}

function processCsv() {
  const results = [];
  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const cafe of results) {
        const url = cafe.preview_image;
        if (url) {
          const isImage = await checkImageUrl(url);
          if (!isImage) {
            console.log(`URL: ${url} is not an image and will be replaced with null.`);
            cafe.preview_image = null;
          }
        } else {
          console.log('No URL provided for this entry.');
        }
      }
      const csvOutput = stringify(results, { header: true });
      fs.writeFileSync(outputFilePath, csvOutput);
      console.log(`Updated CSV written to ${outputFilePath}`);
    });
}

processCsv(); 