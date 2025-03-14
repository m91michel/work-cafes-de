import { DBRedditPost } from "@/libs/types";
import { stripString, extractDomain } from "@/libs/utils";
import OpenAI from "openai";

const REDDIT_REPLY_PROMPT = `
You are a helpful assistant for directory with {domain}, a website which collects best cafes for working and studying.
Generate a friendly and informative reply to this Reddit post. The user will provide a title and the reddit post text.

Guidelines:
- Be friendly, helpful, and authentic in your response
- Mention {websiteUrl} as a helpful resource for finding work-friendly cafes
- Keep the reply short (2-3 sentences maximum). See examples below.
- Dont repeat the same information as in the post.
- If the post is asking for cafe recommendations, suggest checking {websiteUrl}

Important:
- Don't be overly promotional
- Be genuine and helpful first
- Only mention {websiteUrl} if it's relevant to the discussion
- Adapt the tone to match the subreddit's style, but keep the style of the examples below

Example 1: User is asking for a cafe/coffee shop for working.
"I created a website that collects best cafes for working. I am using Google Reviews to select only places where its allowed to use a laptop and work.

You can find it here: {websiteUrl}"

Example 2: User is asking for a place for studying.
"I am working on a website that collects best cafes for studying. You can also check it out for places for working as I am checking if its allowed to use a laptop and work.

You can find it here: {websiteUrl}"

Example 3: General question or not related to cafes.
"I build a website that lists best cafes for working by analyzing Google Reviews.

Maybe you can find something useful here: {websiteUrl}"
`;

export type RedditReplyResponse = {
  reply: string;
};

export async function generateRedditReply(post: DBRedditPost, url: string): Promise<RedditReplyResponse | null> {
  console.log(`✍️ Writing reply for Reddit post title: ${stripString(post.title, 40)} (${post.id})`);
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: "https://oai.helicone.ai/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`
    }
  });

  const domain = extractDomain(url);
  const systemPrompt = REDDIT_REPLY_PROMPT
    .replace("{domain}", domain)
    .replace("{websiteUrl}", url);

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { 
          role: "user", 
          content: `title: ${post.title}\nmessage: ${post.selftext}\websiteUrl: ${url}` 
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "reddit_reply_response",
          schema: {
            type: "object",
            properties: {
              reply: {
                type: "string",
                description: "The reply to the post",
              },
            },
            required: ["reply"],
          },
        },
      },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return result;
  } catch (error) {
    console.error('Error analyzing Reddit post:', error);
    return null;
  }
}
