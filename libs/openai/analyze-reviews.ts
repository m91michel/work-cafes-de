import OpenAI from "openai";

const PROMPT = `
### **System Prompt**  
You are an AI assistant that analyzes customer reviews to determine if a café is laptop-friendly.

#### **Input Format**  
You will receive a list of reviews for a specific café, each containing:  
- **Name** (Reviewer Name)  
- **Date** (Review Date)  
- **Review Text**  

#### **Evaluation Criteria**  
Assess if the café meets one of the following **laptop-friendly** requirements:  
1. **WiFi Availability** – Does the review mention that the café has WiFi?  
2. **Laptop Policy** – Does the review mention that the café allows customers to use a laptop?
3. **Suitable for Working** – Does the review mention that the café is suitable for working?

In case of mixed reviews of working WiFI use 'PUBLISHED' status and 'Unknown' for wifi_quality.

#### **Output Format**  
Return a JSON object with the following fields:  

'json
{
  "status": "PUBLISHED | DISCARDED | UNKNOWN",
  "wifi_quality": "Unknown | Available | Unavailable | Poor | Average | Good",
  "ambiance": "Quiet and Cozy | Lively | Noisy | Unknown",
  "seating_comfort": "Unknown | Comfortable | Very Comfortable | Slightly Uncomfortable"
}
'

- **status**:  
  - **PUBLISHED** → If reviews mentions that the cafe is suitable for working **or** WiFi is available **or** laptop use is allowed.  
  - **DISCARDED** → If people confirm that its not allowed to use a laptop.  
  - **UNKNOWN** → If there is no clear mention of WiFi or laptop policies.  

- **wifi_quality**:  
  - **Unknown** → If no review mentions WiFi quality.  
  - **Available** → If reviews at LEAST ONE mention that the WiFi is available.
  - **Unavailable** → If ALL reviews mention that the WiFi is unavailable.  
  - **Poor** → If reviews complain about slow or unreliable WiFi.  
  - **Average** → If reviews mention usable but not great WiFi.  
  - **Good** → If reviews praise the WiFi speed and reliability.  

- **ambiance**:  
  - **Quiet and Cozy** → If reviews describe a calm and comfortable atmosphere.  
  - **Lively** → If reviews mention a social but manageable noise level.  
  - **Noisy** → If reviews indicate a loud or distracting environment.  
  - **Unbekannt** → If ambiance is not mentioned.  

- **seating_comfort**:  
  - **Unknown** → If no review mentions seating comfort.  
  - **Comfortable** → If seating is described as generally good.  
  - **Very Comfortable** → If seating is explicitly praised.  
  - **Slightly Uncomfortable** → If seating is mentioned as not ideal but usable.  

#### **Example Input (Reviews)**  
'''
Name: Alice
Date: 2024-01-15
Review: Great coffee! WiFi was fast and stable.

Name: Bob
Date: 2024-01-18
Review: The staff was friendly. Saw people working on laptops, no issues!
'''

#### **Example Output**  
'''json
{
  "status": "PUBLISHED",
  "wifi_quality": "Good",
  "ambiance": "Quiet and Cozy",
  "seating_comfort": "Comfortable"
}
'''
`;

export type AIReview = {
  name: string;
  date: string;
  review: string;
}
type AIResponse = {
  status: string;
  wifi_quality: string;
  ambiance: string;
  seating_comfort: string;
}

export async function analyzeReviews(reviews?: AIReview[] | null): Promise<AIResponse | null> {
  if (!reviews) {
    console.log("⚠️ No reviews provided");
    return null;
  }

  console.log(`👀 Analyzing ${reviews.length} reviews...`);
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
          content: PROMPT,
        },
        { role: "user", content: formatReviews(reviews) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "reviews_analysis",
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                description: "Status of the reviews analysis (PUBLISHED | DISCARDED | UNKNOWN)",
              },
              wifi_quality: {
                type: "string",
                description: "Quality of the WiFi (Unknown | Poor | Average | Good)",
              },
              ambiance: {
                type: "string",
                description: "Ambiance of the café (Quiet and Cozy | Lively | Noisy | Unknown)",
              },
              seating_comfort: {
                type: "string",
                description: "Seating comfort of the café (Unknown | Comfortable | Very Comfortable | Slightly Uncomfortable)",
              },
            },
            required: ["status", "wifi_quality", "ambiance", "seating_comfort"],
          },
        },
      },
    });

    const response_json = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    if (!response_json.status) {
      console.log(`No status or wifi_quality found for ${reviews}`);
      return null;
    }

    return response_json;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function formatReviews(reviews: AIReview[]): string {
  return reviews.map(review => `Name: ${review.name}\nDate: ${review.date}\nReview: ${review.review}`).join('\n\n');
}
