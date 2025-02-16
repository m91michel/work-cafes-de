import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(string: string): string {
  return string.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9-]/g, '') // remove any non-alphanumeric characters
    .replace(/-+/g, '-') // replace multiple dashes with a single dash
    .replace(/^-|-$/g, '') // remove dashes at the beginning and end
}

// Returns a list of urls from a string
export function parseUrls(string: string): string[] {
  const urls = string.match(/(https?:\/\/[^\s]+)/g);
  return urls ? urls.map(url => url.trim()) : [];
}

export const extractToken = (authValue?: string | null) => {
  if (!authValue) return null;

  const startsWith = "Bearer "
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
    const cleanedLink = links.replace(/^Website:\s*/, '');
    const url = new URL(cleanedLink);
    return url.origin + url.pathname;
  } catch (error) {
    console.error('Invalid URL:', links);
    return null;
  }
}

export function mergeObjects(initialObject?: any | null, newObject?: Record<string, any> | null) {
  if (!initialObject) {
    return null;
  }

  return {
    ...(typeof initialObject === "object" && initialObject !== null
      ? initialObject
      : {}),
    ...newObject,
  };
}