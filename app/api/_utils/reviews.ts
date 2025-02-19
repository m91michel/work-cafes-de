

export const reviewKeywords = [
    // English terms
    "working", "wifi", "internet", "outlet", "reading", "work", "laptop", "study",
    // German terms
    "arbeiten", "wlan", "lesen", "steckdosen", "arbeitsplatz", "laptop"
];


export function containsWorkingKeywords(text?: string) {
    if (!text) return false;

    return reviewKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }