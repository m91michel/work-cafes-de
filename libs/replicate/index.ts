import Replicate from "replicate";

const auth = process.env.REPLICATE_API_TOKEN;
const replicate = new Replicate({ auth });

// https://replicate.com/recraft-ai/recraft-v3
const model = "recraft-ai/recraft-v3";

export async function createReplicateImage(prompt: string) {
    const input = {
        size: "1365x1024",
        prompt: prompt
    };

    const output = await replicate.run(model, { input });
    console.log(`🎉 generated image with model ${model} ${output}`);
    return String(output);
}

