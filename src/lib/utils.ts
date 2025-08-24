import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(value: string): string {
  // Remove all non-digits
  const phoneNumber = value.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else {
    // If more than 10 digits, just show first 10 formatted
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
}

export function getAppUrl() {
  // In development, use the actual port
  if (process.env.NODE_ENV === 'development') {
    return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:9002';
  }
  // In production, use the configured URL
  return process.env.NEXT_PUBLIC_APP_URL || 'https://homerenrichment.com';
}
