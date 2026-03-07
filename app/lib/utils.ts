import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Toggle an item in an array - adds if absent, removes if present.
 */
export function toggleArrayItem<T>(arr: T[], item: T): T[] {
  const set = new Set(arr);
  if (set.has(item)) set.delete(item);
  else set.add(item);
  return Array.from(set);
}
