import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { YEAR_OF_STUDY } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearOfStudy(year: string) {
  return YEAR_OF_STUDY.find((item) => item.value === year)?.label ?? "1st";
}
