import { format } from "date-fns";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { inferSchema, initParser } from "udsv";

import { parseLabDateHeader } from "./labs-utils";
import { LabsTableClient } from "./LabsTableClient";

export const runtime = "nodejs";

interface LabTestRow {
  testName: string;
  units: string;
  referenceRange: string;
  resultsByDate: Record<string, string>;
}

function formatDateLabel(date: Date): string {
  // compact label for header cells
  return format(date, "M/d/yy");
}

export default async function ShaneHealthLabsPage() {
  // Use a stable filesystem path. Using `new URL("./labs.csv", import.meta.url)`
  // can be rewritten by Next into `/_next/static/media/...`, which is not a file URL.
  const csvPath = resolve(process.cwd(), "src/app/shane/health/labs/labs.csv");
  const csvStr = await readFile(csvPath, "utf8");

  const schema = inferSchema(csvStr);
  const parser = initParser(schema);

  const headers: string[] = schema.cols.map((c) => c.name);
  const dataRows: string[][] = parser.stringArrs(csvStr);

  const dateHeaders = headers.slice(3);
  const parsedDates = dateHeaders
    .map((h) => parseLabDateHeader(h))
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const dateColumns = parsedDates.map((d) => ({
    raw: d.raw,
    label: formatDateLabel(d.date),
  }));

  const tests: LabTestRow[] = dataRows.map((row) => {
    const testName = row[0] ?? "";
    const units = row[1] ?? "";
    const referenceRange = row[2] ?? "";

    const resultsByDate: Record<string, string> = {};
    for (let i = 3; i < headers.length; i += 1) {
      const key = headers[i] ?? "";
      if (!key) continue;
      resultsByDate[key] = row[i] ?? "";
    }

    return { testName, units, referenceRange, resultsByDate };
  });

  return <LabsTableClient tests={tests} dateColumns={dateColumns} />;
}
