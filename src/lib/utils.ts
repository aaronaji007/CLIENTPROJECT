import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  AUD: "A$",
  NZD: "NZ$",
  CAD: "C$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

/** Format a package price string with the proper currency symbol or code. */
export function formatPackagePrice(price: string, currency?: string): string {
  const code = (currency || "USD").toUpperCase();
  const sym = CURRENCY_SYMBOLS[code] ?? `${code} `;
  return `${sym}${price}`;
}
