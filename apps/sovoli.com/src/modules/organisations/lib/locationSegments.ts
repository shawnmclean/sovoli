import { slugify } from "~/utils/slugify";

const capitalizeWord = (word: string) =>
  word.length === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);

export const toLocationSegment = (value: string) => slugify(value);

export const doesLocationValueMatchSegment = (
  value: string | undefined,
  segment: string,
) => {
  if (!value) {
    return false;
  }
  return slugify(value) === segment.toLowerCase();
};

export const toDisplayLocationSegment = (segment: string) =>
  segment
    .split("-")
    .map((word) => capitalizeWord(word))
    .join(" ");
