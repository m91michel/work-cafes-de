

export const reviewKeywords = [
    // English terms
    "working", "wifi", "internet", "plug", "reading",
    // German terms
    "arbeiten", "wlan", "lesen", "steckdosen", "arbeitsplatz"
];


export function containsWorkingKeywords(text?: string) {
    if (!text) return false;

    return reviewKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }