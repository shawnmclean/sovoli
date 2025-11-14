export function formatDate(value?: string) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatTimeline(start?: string, end?: string) {
  const formattedStart = formatDate(start);
  const formattedEnd = formatDate(end);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} – ${formattedEnd}`;
  }
  if (formattedStart) return `Starts ${formattedStart}`;
  if (formattedEnd) return `Complete by ${formattedEnd}`;

  return null;
}
