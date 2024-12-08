import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(string: string): string {
  return string.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}