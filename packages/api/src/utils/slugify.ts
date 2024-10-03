export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .filter((word) => word.length)
    .join("-");
};
