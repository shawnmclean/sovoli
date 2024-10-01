import { format, formatDistance } from "date-fns";

// Shared logic for calculating time ago
export const getTimeAgo = (datetime: Date) => {
  const timeAgo = formatDistance(datetime, new Date(), { addSuffix: true });
  const isoString = datetime.toISOString(); // ISO for web
  const fullDate = format(datetime, "EEEE, MMMM d, yyyy 'at' h:mm:ss a z"); // Full format for title
  return { timeAgo, isoString, fullDate };
};
