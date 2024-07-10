import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment";
import { usePathname } from "next/navigation";

export function removeNewlinesAndTrim(input: string): string {
  return input.replace(/[\r\n]+/g, "").trim();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToAscii(inputString: string) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}

export const delay = (ms: number = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const formatDate = (date: string) => {
  return moment(date).format('MMM-DD-YYYY h:mm:ss A')
}

export const generateId = (length = 5) => Math.random().toString(36).substr(2, length);

export const stringToSlug = (str: string): string => {
  // Convert to lower case
  str = str.toLowerCase();

  // Replace invalid characters with a hyphen
  // This regex replaces spaces with hyphens and removes characters that are not alphanumeric, underscores, or hyphens
  str = str.replace(/[\s\W-]+/g, '-');

  // Remove leading and trailing hyphens
  str = str.replace(/^-+|-+$/g, '');

  return str;
}

export const redirectUrl = (url: string) => window.open(url, "_self")

export const isValidValue = (value: any): boolean => {
  return value !== null && value !== undefined && !isNaN(value);
}

export const pushToNewTab = (route: string) => window.open(route, "_blank");

export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const formatNumber = (amount: number, decimalPoint: number = 2): string => {
  return amount.toLocaleString('en-US', {
      minimumFractionDigits: decimalPoint,
      maximumFractionDigits: 2
  });
}

export const validateGitHubRepoUrl = (url: string) => {
  const githubRepoPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
  return githubRepoPattern.test(url) || "Please enter a valid GitHub repository URL";
};

export const formatPrice = (
  num: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};