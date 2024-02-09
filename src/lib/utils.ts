import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertFileToUrl(file: File) {return  URL.createObjectURL(file)}

export const toBase64 = (file:File) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
}) 

export const toTimeAgo = (timestamp: Date) => {
    const now = Date.now();
    const secondsAgo = Math.floor((now - timestamp.getMilliseconds()) / 1000);
  
    if (secondsAgo < 60) {
      return `${secondsAgo}s ago`;
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60); // minute
      return `${minutesAgo}m ago`;
    } else if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600); // hour
      return `${hoursAgo}h ago`;
    } else if (secondsAgo < 604800) {
      const daysAgo = Math.floor(secondsAgo / 86400); // day
      return `${daysAgo}d ago`;
    } else {
      const weeksAgo = Math.floor(secondsAgo / 604800); // week
      return `${weeksAgo}w ago`;
    }
};

export const getInitials = (fullName: string) => {
  const names = fullName.split(' ');

  if (!names) return;

  const initials = names.length > 1 ? names[0].charAt(0) + names[1].charAt(0) : names[0].charAt(0);
  return initials.toUpperCase();
}
