export interface Interval {
  min: number | null;
  max: number | null;
  minInclusive: boolean;
  maxInclusive: boolean;
}

export interface ParseIntervalOptions {
  /**
   * If a reference range is a single number (e.g. "4.5"), interpret it as an
   * upper bound (<= 4.5). This matches the user preference for this page.
   */
  singleNumberAsMax?: boolean;
}

function normalizeRangeString(input: string): string {
  return (
    input
      .trim()
      // normalize various dash characters to hyphen
      .replaceAll("–", "-")
      .replaceAll("‑", "-")
      // collapse whitespace
      .replaceAll(/\s+/g, " ")
  );
}

function parseNumberLoose(input: string): number | null {
  const cleaned = input.trim().replaceAll(",", "");
  if (!cleaned) return null;

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function parseInterval(
  raw: string | null | undefined,
  opts: ParseIntervalOptions = {},
): Interval | null {
  if (!raw) return null;

  const s = normalizeRangeString(raw);
  if (!s) return null;

  // Comparators: >=, <=, >, <
  const comparatorRe = /^(>=|<=|>|<)\s*([+-]?\d+(?:\.\d+)?)$/;
  const comparatorMatch = comparatorRe.exec(s);
  if (comparatorMatch !== null) {
    const op = comparatorMatch[1] ?? "";
    const n = parseNumberLoose(comparatorMatch[2] ?? "");
    if (n === null) return null;

    if (op === ">") {
      return { min: n, max: null, minInclusive: false, maxInclusive: false };
    }
    if (op === ">=") {
      return { min: n, max: null, minInclusive: true, maxInclusive: false };
    }
    if (op === "<") {
      return { min: null, max: n, minInclusive: false, maxInclusive: false };
    }
    // <=
    return { min: null, max: n, minInclusive: false, maxInclusive: true };
  }

  // Between: a-b (inclusive)
  const betweenRe = /^([+-]?\d+(?:\.\d+)?)\s*-\s*([+-]?\d+(?:\.\d+)?)$/;
  const betweenMatch = betweenRe.exec(s);
  if (betweenMatch !== null) {
    const a = parseNumberLoose(betweenMatch[1] ?? "");
    const b = parseNumberLoose(betweenMatch[2] ?? "");
    if (a === null || b === null) return null;

    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return { min, max, minInclusive: true, maxInclusive: true };
  }

  // Single number:
  const single = parseNumberLoose(s);
  if (single !== null) {
    if (opts.singleNumberAsMax) {
      return { min: null, max: single, minInclusive: false, maxInclusive: true };
    }
    return { min: single, max: single, minInclusive: true, maxInclusive: true };
  }

  return null;
}

/**
 * Returns whether two numeric intervals overlap (share any possible value).
 */
export function intervalsOverlap(a: Interval, b: Interval): boolean {
  const endsBeforeStart = (
    end: number,
    endInclusive: boolean,
    start: number,
    startInclusive: boolean,
  ) => {
    if (end < start) return true;
    if (end > start) return false;
    // end === start: overlaps only if both include boundary
    return !(endInclusive && startInclusive);
  };

  // If a is entirely to the left of b
  if (a.max !== null && b.min !== null) {
    if (endsBeforeStart(a.max, a.maxInclusive, b.min, b.minInclusive)) {
      return false;
    }
  }

  // If b is entirely to the left of a
  if (b.max !== null && a.min !== null) {
    if (endsBeforeStart(b.max, b.maxInclusive, a.min, a.minInclusive)) {
      return false;
    }
  }

  return true;
}

export function isOutOfRange(
  referenceRangeRaw: string | null | undefined,
  resultRaw: string | null | undefined,
): boolean {
  const ref = parseInterval(referenceRangeRaw, { singleNumberAsMax: true });
  const result = parseInterval(resultRaw);

  if (ref === null || result === null) return false;

  return !intervalsOverlap(ref, result);
}

export function parseLabDateHeader(
  header: string,
): { raw: string; date: Date } | null {
  const s = header.trim();
  const parts = s.split("/");
  if (parts.length !== 3) return null;

  const month = Number(parts[0]);
  const day = Number(parts[1]);
  const year = Number(parts[2]);

  if (
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    !Number.isFinite(year) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  // Create a local date; we only need ordering + label.
  return { raw: s, date: new Date(year, month - 1, day) };
}

