import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(string: string): string {
  return string.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') // replace multiple dashes with a single dash
    .replace(/^-|-$/g, '') // remove dashes at the beginning and end
    .replace(/[^a-z0-9-]/g, '');
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
