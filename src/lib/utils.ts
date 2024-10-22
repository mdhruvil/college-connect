import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { YEAR_OF_STUDY } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearOfStudy(year: string) {
  return YEAR_OF_STUDY.find((item) => item.value === year)?.label ?? "1st";
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export function getInitials(name: string) {
  const [firstName, lastName] = name.split(" ");
  return `${firstName?.charAt(0)}${lastName?.charAt(0)}`;
}

export function generateSixDigitUniqueNumber() {
  const now = Date.now();
  const timestamp = now % 1000000; // Get last 6 digits of timestamp
  const randomPart = (now % 1000) * 1000 + (performance.now() % 1000);
  const combined = (timestamp + randomPart) % 1000000;
  return parseInt(combined.toString().padStart(6, "0"));
}
