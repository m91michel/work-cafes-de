import { RedditPost } from "@/libs/types";
import { stripString } from "@/libs/utils";
import OpenAI from "openai";

const REDDIT_ANALYSIS_PROMPT = `
You are a helpful assistant that analyzes Reddit posts to determine if users are searching for cafes/coffee shops or places to work/study/reading a book. Your task is to analyze the post content and returning the following information:

Return the output in the following JSON format:

{
    "isRelevant": boolean,
    "keywords": string[],
    "confidence": number (0-3),
    "reasoning": string
}

Guidelines:
- Set isRelevant to true if the post is specifically about finding cafes/places to work or study
- List specific keywords (e.g., "wifi", "quiet", "power outlets", "good coffee"). [] if not mentioned
- Confidence score (0-3) indicating how certain you are about the analysis.
  - Clear no (0) if the post is not related. (Not search for cafes, looking for events or any general questions)
  - Medium (1) if the post is ambiguous as the searches for coffee places
  - High (2) if the post is about finding cafe/places to work/study and the intent is clear
  - Very High (3) if the post is about finding cafe/places to work/study and the intent is very clear
- Reasoning: Explain your reasoning for the analysis

Relevant Examples (should return isRelevant = true):
- "Can anyone recommend cafes with good wifi for working in Berlin?"
- "Looking for quiet study spots in Munich where I can spend a few hours"
- "Raum für kostengünstige Besprechung gesucht in Frankfurt"
- "Best places to work remotely in NYC? Need power outlets and decent wifi"
- "Where can I find cafes that are laptop-friendly in Seattle?"
- "Suche nach einem ruhigen Café zum Arbeiten in Hamburg mit guter WLAN-Verbindung"
- "Student looking for cafes to study in Chicago that stay open late"
- "Need recommendations for cafes where I can work for several hours in Boston"
- "Coworking spaces or cafes in Dresden where I can take video calls?"
- "Wo kann man in Köln gut mit dem Laptop arbeiten?"

NOT Relevant Examples (should return isRelevant = false):
- "Best coffee shops in Berlin for a first date"
- "Looking for a cafe to host my birthday party in Munich"
- "Recommendations for breakfast spots in NYC with good pastries"
- "Suche nach einem Café für eine Hochzeitsfeier in Hamburg"
- "Coffee shops with the best espresso in Seattle?"
- "I work remotely and sometimes go to coffee shops, but today I'm looking for bar recommendations"
- "Unique Creative Activities and Foodie Spot Recommendations"
- "How serious is risk of deportation for Digital Nomads in Bali?"
- "Anyone know whats going in at the old foxtrot burnet location?"
- "What's your favorite cafe for meeting friends in Chicago?"
- "Cafes with outdoor seating in Boston for enjoying summer weather"
- "Beste Kuchen in Dresdner Cafés gesucht"
- "Looking for a cafe that serves good gluten-free options in Portland"
- "Sweet Potato Coffee or Pastries in DC?"

Important:
- Check the post title and body and clearly determine if the post is about finding cafe/places to work/study
- Think step by step and justify your answer
- Explain your reasoning for the analysis
`;

/*
Ambiguous Examples (require careful analysis) indicating low confidence:
- "Places to sit for a few hours in Berlin" (depends on context - working/studying or just leisure?)
- "Cafes with free wifi in Munich" (wifi could be for work or just casual browsing)
- "Quiet spots in NYC where I can spend the day" (could be for work or leisure)
- "Cafes that don't mind if you stay for a long time in Hamburg" (could be for work or other activities)
- "Suche nach einem Ort mit Steckdosen in Frankfurt" (power outlets could be for work devices or just charging phone)
*/

export type RedditAnalysisResponse = {
  isRelevant: boolean;
  keywords: string[];
  confidence: number;
  reasoning?: string;
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
              isRelevant: {
                type: "boolean",
                description: "User is searching for a cafe for working, studying or reading a book",
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
                description: "The confidence score (0-3) indicating how certain you are about the analysis",
              },
              reasoning: {
                type: "string",
                description: "Explain your reasoning for the analysis",
              },
            },
            required: ["isRelevant", "keywords", "confidence", "reasoning"],
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
