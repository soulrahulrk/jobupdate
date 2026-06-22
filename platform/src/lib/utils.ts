import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an INR salary range like "₹4–7 LPA" from rupee amounts. */
export function formatSalary(min?: number | null, max?: number | null): string | null {
  if (!min && !max) return null;
  const lpa = (n: number) => (n / 100000).toFixed(n % 100000 === 0 ? 0 : 1);
  if (min && max) return `₹${lpa(min)}–${lpa(max)} LPA`;
  return `₹${lpa((min ?? max)!)}${min ? "+ " : " "}LPA`;
}

export const REGION_LABEL: Record<string, string> = {
  TRICITY: "Tricity", NCR: "Delhi-NCR", METRO: "Metro", REMOTE: "Remote", OTHER: "Other",
};
export const EXP_LABEL: Record<string, string> = {
  FRESHER: "Fresher", ZERO_ONE: "0–1 yr", ONE_TWO: "1–2 yr", TWO_PLUS: "2+ yr",
};
