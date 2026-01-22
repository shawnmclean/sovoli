import {
  differenceInDays,
  differenceInMonths,
  format,
  parseISO,
} from "date-fns";

// Helper function to format a single date
export const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "MMM d, yyyy");
};

// Helper function to calculate and format duration between two dates
export const calculateDuration = (startDate: string, endDate: string) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const originalDays = differenceInDays(end, start);
  const days = Math.max(1, originalDays);
  const weeks = Math.ceil(originalDays / 7);
  const months = differenceInMonths(end, start);

  if (months >= 3) {
    return `${months} month${months !== 1 ? "s" : ""}`;
  } else if (weeks >= 1) {
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
  } else {
    return `${days} day${days !== 1 ? "s" : ""}`;
  }
};

// Helper function to format date range compactly
export const formatDateRange = (startDate: string, endDate: string) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const now = new Date();
  const isSameDay = start.getTime() === end.getTime();
  const isSameYear = start.getFullYear() === end.getFullYear();
  const isThisYear =
    start.getFullYear() === now.getFullYear() &&
    end.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return formatDate(startDate);
  }

  // If both dates are in the same year and it's this year, omit the year from both
  if (isSameYear && isThisYear) {
    return `${start.toLocaleDateString("en-GY", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-GY", { month: "short", day: "numeric" })}`;
  }

  // If both dates are in the same year but not this year, show year only on end
  if (isSameYear) {
    return `${start.toLocaleDateString("en-GY", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-GY", { month: "short", day: "numeric", year: "numeric" })}`;
  }

  // If years are different, show full date for both
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

// Helper function to format cycle label as date range
export const formatCycleLabel = (
  startDate: string | undefined,
  endDate: string | undefined,
): string => {
  if (!startDate || !endDate) return "Academic Cycle";

  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const now = new Date();
  const isSameDay = start.getTime() === end.getTime();
  const isSameYear = start.getFullYear() === end.getFullYear();
  const isThisYear =
    start.getFullYear() === now.getFullYear() &&
    end.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return format(start, "MMM d");
  }

  // If both dates are in the same year and it's this year, omit the year from both
  if (isSameYear && isThisYear) {
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }

  // If both dates are in the same year but not this year, show year only on end
  if (isSameYear) {
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  }

  // If years are different, show full date for both
  return `${format(start, "MMM d")}-${format(end, "MMM d, yyyy")}`;
};

// Helper function to get current date
export const getCurrentDate = () => new Date();

// Helper function to check if date is in the future
export const isDateInFuture = (dateString: string) => {
  const date = parseISO(dateString);
  return date > getCurrentDate();
};

// Helper function to get cycle status
export const getCycleStatus = (startDate: string, endDate: string) => {
  const now = getCurrentDate();
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "current";
  return "completed";
};
