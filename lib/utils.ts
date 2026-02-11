import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidYoutubeUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    return (
      hostname === "www.youtube.com" ||
      hostname === "youtube.com" ||
      hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}

export function isValidLinkedinUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    return (
      hostname === "www.linkedin.com" ||
      hostname === "linkedin.com"
    );
  } catch {
    return false;
  }
}
export function isPersonalEmail(email: string) {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const organizationalPatterns = ['.edu', '.gov', '.ac.'];
  return !organizationalPatterns.some(pattern => domain.includes(pattern));
}
