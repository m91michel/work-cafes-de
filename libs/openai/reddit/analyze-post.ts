import { City, RedditPost } from "@/libs/types";
import { stripString } from "@/libs/utils";
import OpenAI from "openai";

const REDDIT_ANALYSIS_PROMPT = `System Prompt:
You are a helpful assistant that analyzes Reddit posts to determine if users are searching for cafes or places to work/study. Your task is to analyze the post content and extract relevant information.

Please analyze the post and return a JSON response with the following structure:

1. Determine if the post is about searching for work-friendly cafes/places
2. Extract the city/location mentioned
3. Identify any specific keywords mentioned

Return the output in the following format:

{
    "isSearchingForWorkCafe": boolean,
    "city": string | null,
    "keywords": string[],
    "confidence": number (0-10),
    "shouldReply": number (0-10)
}

Guidelines:
- Set isSearchingForWorkCafe to true if the post is specifically about finding cafes/places to work or study
- Extract the city name if mentioned, return null if unclear
- List specific keywords (e.g., "wifi", "quiet", "power outlets", "good coffee"). [] if not mentioned
- Confidence score (0-10) indicating how certain you are about the analysis. Even if the post is not about finding cafe/places to work/study, you should still be confident about the analysis.
- ShouldReply score (0-10) indicating if I should reply and mention my website.
`;

export type RedditAnalysisResponse = {
  isSearchingForWorkCafe: boolean;
  city: string | null;
  keywords: string[];
  confidence: number;
  shouldReply: number;
};

export async function analyzeRedditPost(post: RedditPost): Promise<RedditAnalysisResponse | null> {
  console.log(`🔍 Analyzing Reddit post ${post.id} title: ${stripString(post.title, 40)}`);
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: "https://oai.helicone.ai/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`
    }
  });

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: REDDIT_ANALYSIS_PROMPT,
        },
        { 
          role: "user", 
          content: `subreddit: r/${post.subreddit}\ntitle: ${post.title}\nbody: ${post.selftext}` 
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "reddit_analysis_response",
          schema: {
            type: "object",
            properties: {
              isSearchingForWorkCafe: {
                type: "boolean",
                description: "Whether the post is about searching for work-friendly cafes/places",
              },
              city: {
                type: "string",
                description: "The city mentioned in the post",
              },
              keywords: {
                type: "array",
                description: "The keywords mentioned in the post. [] if not mentioned",
                items: {
                  type: "string",
                },
              },
              confidence: {
                type: "number",
                description: "The confidence score (0-10) indicating how certain you are about the analysis",
              },
              shouldReply: {
                type: "number",
                description: "The shouldReply score (0-10) indicating how likely you are to reply to the post",
              },
            },
            required: ["isSearchingForWorkCafe", "keywords", "confidence", "shouldReply"],
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
