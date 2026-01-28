import type { BillingInvoiceLineItem } from "../types";

/**
 * Format a billing period for display.
 * @param start ISO timestamp (optional)
 * @param end ISO timestamp (optional)
 * @param uppercase Whether to format in uppercase with full month names (default: false)
 * @returns Formatted period string or "Not specified"
 */
export function formatPeriod(
  start?: string,
  end?: string,
  uppercase = false,
): string {
  if (!start || !end) return "Not specified";

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return "Invalid dates";
    }

    if (uppercase) {
      // Format as "DECEMBER 31, 2025 - JANUARY 31, 2026"
      const startFormatted = startDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const endFormatted = endDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return `${startFormatted.toUpperCase()} - ${endFormatted.toUpperCase()}`;
    }

    // Format as "Dec 31, 2025 - Jan 31, 2026"
    const startFormatted = startDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const endFormatted = endDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return "Invalid dates";
  }
}

/**
 * Calculate the number of days in a billing period.
 * Uses [start, end) convention (inclusive start, exclusive end).
 * @param start ISO timestamp
 * @param end ISO timestamp
 * @returns Number of days
 */
export function calculatePeriodDays(start: string, end: string): number {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return 0;
    }

    // Calculate difference in milliseconds, convert to days
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  } catch {
    return 0;
  }
}

/**
 * Derive invoice period from line items.
 * Returns the minimum periodStart and maximum periodEnd from all line items.
 * @param lineItems Array of invoice line items
 * @returns Object with periodStart and periodEnd, or undefined if no periods found
 */
export function deriveInvoicePeriod(
  lineItems?: BillingInvoiceLineItem[],
): { periodStart: string; periodEnd: string } | undefined {
  if (!lineItems || lineItems.length === 0) {
    return undefined;
  }

  const periods = lineItems
    .filter((li) => li.periodStart && li.periodEnd)
    .map((li) => ({
      start: li.periodStart!,
      end: li.periodEnd!,
    }));

  if (periods.length === 0) {
    return undefined;
  }

  const periodStarts = periods.map((p) => new Date(p.start).getTime());
  const periodEnds = periods.map((p) => new Date(p.end).getTime());

  const minStart = new Date(Math.min(...periodStarts));
  const maxEnd = new Date(Math.max(...periodEnds));

  return {
    periodStart: minStart.toISOString(),
    periodEnd: maxEnd.toISOString(),
  };
}

/**
 * Format proration information for display.
 * @param proration Proration info object
 * @returns Formatted proration string
 */
export function formatProration(proration: {
  fullPeriodDays: number;
  usedDays: number;
  factor: number;
}): string {
  const { fullPeriodDays, usedDays, factor } = proration;
  const percentage = (factor * 100).toFixed(1);
  return `${usedDays} of ${fullPeriodDays} days (${percentage}%)`;
}

/**
 * Format a single date for display in invoice context.
 * @param date ISO timestamp
 * @returns Formatted date string
 */
export function formatInvoiceDate(date?: string): string {
  if (!date) return "—";

  try {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

/**
 * Format a date and time for display in invoice context.
 * @param date ISO timestamp
 * @returns Formatted date and time string
 */
export function formatInvoiceDateTime(date?: string): string {
  if (!date) return "—";

  try {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";

    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}
