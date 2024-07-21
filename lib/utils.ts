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


export const formatPrice = (value: string) => {
  // Remove non-numeric characters
  const [wholePart, _] = value.toString().split('.');
  const numericValue = wholePart.replace(/[^\d]/g, '');
  // Add thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};



export const getSubdomainUrl = (slug: string): string => {
  // Get the current hostname
  const hostname = window.location.hostname;
  
  // Check if we're in a development environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Define the base domain
  const baseDomain = isDevelopment ? 'localhost:3000' : process.env.NEXT_PUBLIC_BASE_DOMAIN;
  
  // Remove the base domain from the hostname to get the current subdomain (if any)
  const currentSubdomain = hostname.replace(`.${baseDomain}`, '');
  
  // If we're already on a subdomain or in development, construct the URL differently
  if (currentSubdomain !== hostname || isDevelopment) {
    return `${window.location.protocol}//${slug}.${baseDomain}`;
  }
  
  // For production on the main domain
  return `${window.location.protocol}//${slug}.${hostname}`;
}

export function getSubdomain(hostname: string | null): string | null {
  if (!hostname) return null;

  // Check if we're in a development environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Define the base domain
  const baseDomain = isDevelopment ? 'localhost:3000' : process.env.BASE_DOMAIN;

  if (!baseDomain) {
    console.error('Base domain is not defined');
    return null;
  }

  // Remove the base domain from the hostname
  const subdomain = hostname.replace(`.${baseDomain}`, '');

  // If the subdomain is the same as the hostname, it means we're on the root domain
  return subdomain === hostname ? null : subdomain;
}

export const removeCommasAndConvertToNumber = (numberString: string): string => {
  return numberString.replace(/,/g, "");
};