import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { transliterate } from "transliteration";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(string: string, id?: string): string {
  // First attempt transliteration
  const transliterated = transliterate(string);

  // If the transliterated result is empty or very different (indicating many non-Latin chars)
  if (transliterated.replace(/[^a-zA-Z0-9]/g, "").length < 2) {
    // Encode original string to URL-safe base64
    const encodedOriginal = Buffer.from(string)
      .toString("base64url")
      .slice(0, 24);
    // Add id if provided to ensure uniqueness
    return id ? `${encodedOriginal}-${id}` : encodedOriginal;
  }

  // For Latin and transliterable scripts, use the previous logic with transliterated string
  return transliterated
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Returns a list of urls from a string
export function parseUrls(string: string): string[] {
  const urls = string.match(/(https?:\/\/[^\s]+)/g);
  return urls ? urls.map((url) => url.trim()) : [];
}

export const extractToken = (authValue?: string | null) => {
  if (!authValue) return null;

  const startsWith = "Bearer ";
  if (authValue && authValue.startsWith(startsWith)) {
    return authValue.substring(startsWith.length, authValue.length);
  }

  return null;
};

// Axios Helper function to get full URL with params
export function getFullUrl(config: any): string {
  const url = new URL(config.url);
  const params = new URLSearchParams(config.params);
  url.search = params.toString();
  return url.toString();
}

// Format links to remove "Website: " prefix and removes any query params
export function formatLinks(links?: string | null) {
  if (!links) {
    return null;
  }

  try {
    // Remove "Website: " prefix if present
    const cleanedLink = links.replace(/^Website:\s*/, "");
    const url = new URL(cleanedLink);
    return url.origin + url.pathname;
  } catch (error) {
    console.error("Invalid URL:", links, error);
    return null;
  }
}

export function mergeObjects(
  initialObject: any | null = {},
  newObject: Record<string, any> | null = {}
) {
  if (!initialObject) {
    return newObject;
  }

  return {
    ...(typeof initialObject === "object" && initialObject !== null
      ? initialObject
      : {}),
    ...newObject,
  };
}

type PaginationParams = {
  limit?: number;
  offset?: number;
};

type QueryFunction<T, P extends PaginationParams = PaginationParams> = (params: P) => Promise<T[]>;

export async function fetchAllRecords<T, P extends PaginationParams>(
  queryFn: QueryFunction<T, P>,
  additionalParams?: Omit<P, keyof PaginationParams>,
  pageSize = 1000
): Promise<T[]> {
  const allRecords: T[] = [];
  let offset = 0;

  while (true) {
    const params = {
      ...additionalParams,
      limit: pageSize,
      offset,
    } as P;

    const records = await queryFn(params);

    if (!records || records.length === 0) {
      break;
    }

    allRecords.push(...records);

    if (records.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  return allRecords;
}

export const extractNameFromEmail = (email: string) => {
  return email.split("@")[0];
};

export const stripString = (string: string, length: number) => {
  if (!string) return "";
  return string.length > length ? string.substring(0, length) + "..." : string;
};

export const extractDomain = (url: string) => {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
};
