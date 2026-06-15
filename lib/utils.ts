import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safely parse fetch responses that are expected to be JSON.
// Returns parsed JSON or throws an Error with the response text if parsing fails.
export async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    // Try parse JSON
    return JSON.parse(text);
  } catch (err) {
    // Log the non-JSON body for debugging
    console.error('parseJsonSafe: non-JSON response from', res.url, 'status', res.status);
    console.error(text?.toString?.() || text);
    throw new Error(`Invalid JSON response (status ${res.status}): ${text?.toString?.().slice(0, 500)}`);
  }
}
