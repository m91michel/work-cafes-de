import OpenAI from "openai";

const PROMPT = `
### **System Prompt**  
You are an AI assistant that analyzes customer reviews to determine if a café is work-friendly.  

#### **Input Format**  
You will receive a list of reviews for a specific café, each containing:  
- **Name** (Reviewer Name)  
- **Date** (Review Date)  
- **Review Text**  

#### **Evaluation Criteria**  
Assess if the café meets the following **work-friendly** requirements:  
1. **WIFI Availability** – Does the review mention that the café has WiFi?  
2. **Laptop Policy** – Does the café allow customers to use a laptop?  

#### **Output Format**  
Return a JSON object with the following fields:  

'json
{
  "status": "PUBLISHED | DISCARDED | UNKNOWN",
  "wifi_quality": "Unknown | Poor | Average | Good",
  "ambiance": "Quiet and Cozy | Lively | Noisy | Unknown",
  "seating_comfort": "Unknown | Comfortable | Very Comfortable | Slightly Uncomfortable"
}
'

- **status**:  
  - **PUBLISHED** → If reviews confirm WiFi is available **and** laptop use is allowed.  
  - **DISCARDED** → If reviews mention that WiFi is unavailable **or** laptops are not allowed.  
  - **UNKNOWN** → If there is no clear mention of WiFi or laptop policies.  

- **wifi_quality**:  
  - **Unknown** → If no review mentions WiFi quality.  
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
'json
[
  { "name": "Alice", "date": "2024-01-15", "review": "Great coffee! WiFi was fast and stable." },
  { "name": "Bob", "date": "2024-01-18", "review": "The staff was friendly. Saw people working on laptops, no issues!" }
]
'

#### **Example Output**  
'json
{
  "status": "PUBLISHED",
  "wifi_quality": "Good",
  "ambiance": "Quiet and Cozy",
  "seating_comfort": "Comfortable"
}
'
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

export async function analyzeReviews(reviews: AIReview[]): Promise<AIResponse | null> {  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        { role: "user", content: `${JSON.stringify(reviews)}` },
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
