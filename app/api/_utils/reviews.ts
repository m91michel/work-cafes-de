

export const reviewKeywords = [
    // English terms
    "working", "wifi", "internet", "outlet", "reading",
    // German terms
    "arbeiten", "wlan", "lesen", "steckdosen", "arbeitsplatz", "laptop"
];


export function containsWorkingKeywords(text?: string) {
    if (!text) return false;

    return reviewKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }