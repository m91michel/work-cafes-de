import axios from "axios";
import fs from "fs";

const PULL_ZONE = process.env.BUNNY_PULL_ZONE || "";
const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || "";
const API_KEY = process.env.BUNNY_API_KEY || "";

export async function uploadImagesToBunny(photoUrl: string, filename: string, folder?: string) {
  try {
    const response = await axios.get(photoUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    const filePath = `/tmp/${filename}`; // Temporary path to save the image

    // Save the buffer to a file
    fs.writeFileSync(filePath, buffer);

    const readStream = fs.createReadStream(filePath);

    const folderPath = folder ? `${folder}/` : "";
    const bunnyResponse = await axios.put(
      `https://storage.bunnycdn.com/${STORAGE_ZONE}/${folderPath}${filename}`,
      readStream,
      {
        headers: {
          AccessKey: API_KEY,
          'Content-Type': 'application/octet-stream',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    if (bunnyResponse.status === 201) {
      const bunnyUrl = `https://${PULL_ZONE}.b-cdn.net/${folderPath}${filename}`;
      return bunnyUrl;
    } else {
      console.error(`Failed to upload image to Bunny.net:`, bunnyResponse.data);
      return null;
    }
  } catch (error) {
    console.error(`Error uploading image to Bunny.net:`, error);
    return null;
  }
}
