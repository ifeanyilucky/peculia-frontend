import { format, parseISO } from "date-fns";

/**
 * Formats a date string or Date object into a readable format.
 * Example: Feb 23, 2026
 */
export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM d, yyyy");
};

/**
 * Formats a date string or Date object into a readable date and time format.
 * Example: Feb 23, 2026 at 10:00 AM
 */
export const formatDateTime = (date: string | Date | undefined): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM d, yyyy 'at' h:mm a");
};

/**
 * Formats a number as Naira currency.
 * Example: ₦1,500.00
 */
export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined) return "₦0.00";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

/**
 * Formats a number.
 * Example: 1,500
 */
export const formatNumber = (amount: number | undefined): string => {
  if (amount === undefined) return "0";
  return new Intl.NumberFormat("en-NG").format(amount);
};
