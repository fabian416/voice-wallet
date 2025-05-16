import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clearIdentityStorage() {
  const keysToRemove = ['credential', 'voiceprint', 'ipfsUrl', 'did', 'linkedResource'];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
}