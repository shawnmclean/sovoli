import type { ProgramEvidence } from "../types/lead-extraction-schema";

/**
 * Parse a date string from extraction (e.g., "January 19", "JAN 30-FEB 1")
 * Returns ISO date string or null if parsing fails
 */
export function parseExtractionDate(dateStr: string): string | null {
  if (!dateStr || typeof dateStr !== "string") {
    return null;
  }

  // Try to parse various formats
  const cleaned = dateStr.trim();

  // Format: "January 19" or "Jan 19"
  const monthDayMatch =
    /^(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})/i.exec(
      cleaned,
    );
  if (monthDayMatch) {
    const monthName = monthDayMatch[1];
    const dayStr = monthDayMatch[2];
    if (!monthName || !dayStr) return null;

    const day = parseInt(dayStr, 10);
    const currentYear = new Date().getFullYear();

    // Map month names to numbers
    const monthMap: Record<string, number> = {
      january: 1,
      jan: 1,
      february: 2,
      feb: 2,
      march: 3,
      mar: 3,
      april: 4,
      apr: 4,
      may: 5,
      june: 6,
      jun: 6,
      july: 7,
      jul: 7,
      august: 8,
      aug: 8,
      september: 9,
      sep: 9,
      october: 10,
      oct: 10,
      november: 11,
      nov: 11,
      december: 12,
      dec: 12,
    };

    const month = monthMap[monthName.toLowerCase()];
    if (month && day >= 1 && day <= 31) {
      const date = new Date(currentYear, month - 1, day);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0] ?? null;
      }
    }
  }

  // Format: "JAN 30-FEB 1" - take the first date
  const rangeMatch =
    /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+(\d{1,2})/i.exec(
      cleaned,
    );
  if (rangeMatch) {
    const monthAbbrRaw = rangeMatch[1];
    const dayStr = rangeMatch[2];
    if (!monthAbbrRaw || !dayStr) return null;

    const monthAbbr = monthAbbrRaw.toUpperCase();
    const day = parseInt(dayStr, 10);
    const currentYear = new Date().getFullYear();

    const monthMap: Record<string, number> = {
      JAN: 1,
      FEB: 2,
      MAR: 3,
      APR: 4,
      MAY: 5,
      JUN: 6,
      JUL: 7,
      AUG: 8,
      SEP: 9,
      OCT: 10,
      NOV: 11,
      DEC: 12,
    };

    const month = monthMap[monthAbbr];
    if (month && day >= 1 && day <= 31) {
      const date = new Date(currentYear, month - 1, day);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0] ?? null;
      }
    }
  }

  // Try ISO format
  const isoMatch = /^\d{4}-\d{2}-\d{2}/.exec(cleaned);
  if (isoMatch) {
    const date = new Date(cleaned);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0] ?? null;
    }
  }

  return null;
}

/**
 * Extract start date from program schedule
 */
export function extractStartDate(
  schedule: ProgramEvidence["schedule"],
): string | null {
  if (!schedule?.dates || schedule.dates.length === 0) {
    return null;
  }

  // Try to parse the first date
  const firstDate = schedule.dates[0];
  if (firstDate) {
    return parseExtractionDate(firstDate);
  }

  return null;
}

/**
 * Calculate end date from start date (default to 3 months later)
 */
export function calculateEndDate(startDate: string): string {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 3);
  return end.toISOString().split("T")[0] ?? startDate;
}

/**
 * Generate cycle ID from program slug and date
 */
export function generateCycleId(
  programSlug: string,
  startDate: string,
): string {
  const dateStr = startDate.replace(/-/g, "");
  return `${programSlug}-${dateStr}`;
}

/**
 * Transform extraction pricing to PricingPackage format
 */
export function transformPricingToPackage(
  pricing: ProgramEvidence["pricing"],
): {
  pricingItems: {
    id: string;
    label: string;
    billingCycle: "one-time" | "annual" | "term" | "program";
    purpose?: "registration" | "tuition" | "materials";
    amount: Record<string, number>;
    notes?: string;
  }[];
  discounts?: never[];
  paymentSplits?: never[];
} {
  const pricingItems: {
    id: string;
    label: string;
    billingCycle: "one-time" | "annual" | "term" | "program";
    purpose?: "registration" | "tuition" | "materials";
    amount: Record<string, number>;
    notes?: string;
  }[] = [];

  if (!pricing) {
    return { pricingItems, discounts: [], paymentSplits: [] };
  }

  // Process registration fees
  if (pricing.registration && pricing.registration.length > 0) {
    for (let i = 0; i < pricing.registration.length; i++) {
      const item = pricing.registration[i];
      if (!item) continue;
      const amount = parseAmount(item.amount);
      if (Object.keys(amount).length > 0) {
        pricingItems.push({
          id: `registration-${i + 1}`,
          label: item.label ?? "Registration",
          billingCycle: "one-time",
          purpose: "registration",
          amount,
          notes: item.notes ?? undefined,
        });
      }
    }
  }

  // Process tuition
  if (pricing.tuition && pricing.tuition.length > 0) {
    for (let i = 0; i < pricing.tuition.length; i++) {
      const item = pricing.tuition[i];
      if (!item) continue;
      const amount = parseAmount(item.amount);
      if (Object.keys(amount).length > 0) {
        const billingCycle =
          (item.billingCycle as
            | "one-time"
            | "annual"
            | "term"
            | "program"
            | undefined) ?? "one-time";
        pricingItems.push({
          id: `tuition-${i + 1}`,
          label: item.label ?? "Tuition",
          billingCycle,
          purpose: "tuition",
          amount,
          notes: item.notes ?? undefined,
        });
      }
    }
  }

  // Process materials
  if (pricing.materials && pricing.materials.length > 0) {
    for (let i = 0; i < pricing.materials.length; i++) {
      const item = pricing.materials[i];
      if (!item) continue;
      const amount = parseAmount(item.amount);
      if (Object.keys(amount).length > 0) {
        pricingItems.push({
          id: `materials-${i + 1}`,
          label: item.label ?? "Materials",
          billingCycle: "one-time",
          purpose: "materials",
          amount,
          notes: item.notes ?? undefined,
        });
      }
    }
  }

  return { pricingItems, discounts: [], paymentSplits: [] };
}

/**
 * Parse amount string to number with currency detection
 * Returns object with currency as key and amount as value
 */
function parseAmount(amountStr: string | undefined): Record<string, number> {
  if (!amountStr || typeof amountStr !== "string") {
    return {};
  }

  // Remove currency symbols and spaces
  const cleaned = amountStr.replace(/[$,\s]/g, "");

  // Try to extract number
  const numberMatch = /^(\d+(?:\.\d+)?)/.exec(cleaned);
  if (!numberMatch) {
    return {};
  }

  const valueStr = numberMatch[1];
  if (!valueStr) return {};

  const value = parseFloat(valueStr);
  if (isNaN(value)) {
    return {};
  }

  // Detect currency from original string
  let currency = "JMD"; // Default
  if (amountStr.includes("$") || amountStr.includes("USD")) {
    currency = "USD";
  } else if (amountStr.includes("GYD") || amountStr.includes("G$")) {
    currency = "GYD";
  } else if (amountStr.includes("JMD") || amountStr.includes("J$")) {
    currency = "JMD";
  }

  return { [currency]: value };
}
