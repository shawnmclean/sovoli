/// <reference types="node" />

/**
 * Usage:
 *   pnpm dlx tsx apps/sovoli.com/scripts/transformers/moey-schools-transformer.ts \
 *     --input <path-to-source-csv> \
 *     --parish "<Parish Name>" \
 *     [--output <optional-output-path>]
 *
 * Example (St. Elizabeth data supplied by the ministry):
 *   pnpm dlx tsx apps/sovoli.com/scripts/transformers/moey-schools-transformer.ts \
 *     --input C:\Users\shawn\Downloads\tabula-Directory-of-Educational-Institutions-2018-19-1.csv \
 *     --parish "St. Elizabeth" \
 *     --output apps/sovoli.com/data/outputs/st-elizabeth-schools.csv
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

type Sector = "Public" | "Private";

type RawRow = string[];

interface IntermediateRecord {
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  moeyCode: string;
  typeLabel: string;
  sector: Sector;
}

interface OutputRecord {
  schoolName: string;
  address: string;
  phone: string;
  ownership: Sector;
  type: string;
  moeyCode: string;
  email: string;
}

const TYPE_LABELS = new Set<string>([
  "Infant",
  "Primary",
  "All Age",
  "Primary & Junior High",
  "Secondary High",
  "Technical High",
  "Agricultural High",
  "Tertiary",
  "Kindergarten & Preparatory",
  "Post Secondary",
  "Excellence",
  "Special",
]);

interface CliOptions {
  input: string;
  output: string;
  parish: string;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value: string): string {
  return (
    normalizeWhitespace(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .trim() || "schools"
  );
}

function parseArgs(argv: string[]): CliOptions {
  const args = new Map<string, string>();

  for (let i = 2; i < argv.length; i++) {
    const current = argv[i];
    if (!current) {
      continue;
    }
    if (current.startsWith("--")) {
      const key = current.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args.set(key, next);
        i += 1;
      } else {
        args.set(key, "true");
      }
    }
  }

  const input = args.get("input");
  if (!input) {
    throw new Error("Missing required --input <path> argument.");
  }

  const parishArg = args.get("parish");
  if (!parishArg) {
    throw new Error("Missing required --parish <name> argument.");
  }

  const parish = normalizeWhitespace(parishArg);

  const output =
    args.get("output") ??
    resolve(SCRIPT_DIR, `../../data/outputs/${slugify(parish)}-schools.csv`);

  return {
    input: resolve(process.cwd(), input),
    output: resolve(process.cwd(), output),
    parish,
  };
}

function parseCsv(text: string): RawRow[] {
  const rows: RawRow[] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      const nextChar = text[i + 1];
      if (inQuotes && nextChar === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") {
        i += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || inQuotes || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeAddress(value: string, parish: string): string {
  let address = normalizeWhitespace(value);
  if (!address) {
    return "";
  }

  const escapedParish = escapeRegex(parish);
  const srPattern = new RegExp(`Sr\\.?\\s+${escapedParish}`, "gi");
  address = address.replace(srPattern, `St. ${parish}`);

  const parishVariants = [
    new RegExp(`(?:,\\s*)*${escapedParish}$`, "i"),
    new RegExp(`(?:,\\s*)*St\\.?\\s+${escapedParish}$`, "i"),
  ];

  for (const pattern of parishVariants) {
    address = address.replace(pattern, "");
  }

  address = address.replace(/,\s*,/g, ", ").replace(/,\s*$/, "").trim();

  return address;
}

function normalizePhone(value: string): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  let normalized = digits;

  if (normalized.startsWith("1876") && normalized.length === 11) {
    normalized = normalized.slice(1);
  }

  if (normalized.length === 10 && normalized.startsWith("1876")) {
    normalized = normalized.slice(1);
  }

  if (normalized.length === 7) {
    normalized = `876${normalized}`;
  }

  if (normalized.length === 10 && normalized.startsWith("876")) {
    const local = normalized.slice(3);
    return `+1-876-${local.slice(0, 3)}-${local.slice(3)}`;
  }

  if (normalized.length === 3 && normalized === "876") {
    return "";
  }

  if (normalized.length === 10 && !normalized.startsWith("876")) {
    const local = normalized.slice(-7);
    return `+1-876-${local.slice(0, 3)}-${local.slice(3)}`;
  }

  if (normalized.length >= 7) {
    const local = normalized.slice(-7);
    return `+1-876-${local.slice(0, 3)}-${local.slice(3)}`;
  }

  return "";
}

function sanitiseSchoolName(name: string): string {
  return normalizeWhitespace(name);
}

function extractCodeAndName(rawName: string): { code: string; name: string } {
  const trimmed = rawName.trim();
  const match = /^(\d+)\s*(.*)$/.exec(trimmed);
  if (!match) {
    return { code: "", name: trimmed };
  }

  const [, code = "", rawNameOnly = ""] = match;

  return {
    code,
    name: sanitiseSchoolName(rawNameOnly),
  };
}

function rowsToRecords(rows: RawRow[]): IntermediateRecord[] {
  const records: IntermediateRecord[] = [];
  let currentType = "";
  let currentSector: Sector = "Public";
  let lastRecord: IntermediateRecord | undefined;

  for (const rawRow of rows) {
    if (!rawRow.length || rawRow.every((cell) => cell.trim() === "")) {
      continue;
    }

    const [firstCol = "", secondCol = "", thirdCol = "", fourthCol = ""] =
      rawRow;
    const codeCandidate = firstCol.trim();
    const headerLabel = codeCandidate;

    if (/^School Code and Name$/i.test(headerLabel)) {
      continue;
    }

    if (!codeCandidate && secondCol.trim() && lastRecord) {
      lastRecord.address = normalizeWhitespace(
        `${lastRecord.address} ${secondCol}`,
      );
      continue;
    }

    if (
      !codeCandidate &&
      !secondCol.trim() &&
      thirdCol.trim().toLowerCase() === "telephone"
    ) {
      continue;
    }

    if (codeCandidate && !/^\d/.test(codeCandidate)) {
      const typeLabel = normalizeWhitespace(headerLabel);
      if (TYPE_LABELS.has(typeLabel)) {
        currentType = typeLabel;
        if (typeLabel === "Kindergarten & Preparatory") {
          currentSector = "Private";
        }
        continue;
      }

      if (lastRecord) {
        lastRecord.schoolName = sanitiseSchoolName(
          `${lastRecord.schoolName} ${typeLabel}`,
        );
        continue;
      }
    }

    if (!codeCandidate) {
      continue;
    }

    const { code, name } = extractCodeAndName(firstCol);

    if (!code) {
      continue;
    }

    const record: IntermediateRecord = {
      schoolName: name,
      address: normalizeWhitespace(secondCol),
      phone: normalizeWhitespace(thirdCol),
      email: normalizeWhitespace(fourthCol),
      moeyCode: code,
      typeLabel: currentType,
      sector: currentSector,
    };

    records.push(record);
    lastRecord = record;
  }

  return records;
}

function applyTypePrefixes(
  records: IntermediateRecord[],
  parish: string,
): OutputRecord[] {
  const typeUsage = new Map<string, Set<Sector>>();

  for (const record of records) {
    if (!record.typeLabel) continue;
    const usage = typeUsage.get(record.typeLabel) ?? new Set<Sector>();
    usage.add(record.sector);
    typeUsage.set(record.typeLabel, usage);
  }

  return records.map<OutputRecord>((record) => {
    let type = record.typeLabel;
    const usage = typeUsage.get(record.typeLabel);
    if (usage && usage.size > 1) {
      type = `${record.sector} ${type}`.trim();
    }

    const address = normalizeAddress(record.address, parish);
    const phone = normalizePhone(record.phone);

    return {
      schoolName: record.schoolName,
      address,
      phone,
      ownership: record.sector,
      type,
      moeyCode: record.moeyCode,
      email: record.email,
    };
  });
}

function toCsv(records: OutputRecord[]): string {
  const header = [
    "School Name",
    "Address",
    "Number",
    "Ownership Type",
    "Type",
    "MOEY Code",
    "Email",
  ];

  const lines = [header.join(",")];

  for (const record of records) {
    const row = [
      record.schoolName,
      record.address,
      record.phone,
      record.ownership,
      record.type,
      record.moeyCode,
      record.email,
    ].map((value) => {
      const safe = value;
      if (safe.includes('"')) {
        return `"${safe.replace(/"/g, '""')}"`;
      }
      if (safe.includes(",") || safe.includes("\n")) {
        return `"${safe}"`;
      }
      return safe;
    });

    lines.push(row.join(","));
  }

  return lines.join("\n");
}

function ensureDirectoryExists(path: string) {
  const dir = dirname(path);
  mkdirSync(dir, { recursive: true });
}

function main() {
  const { input, output, parish } = parseArgs(process.argv);
  const csvText = readFileSync(input, "utf8");
  const rows = parseCsv(csvText);
  const intermediate = rowsToRecords(rows);
  const finalRecords = applyTypePrefixes(intermediate, parish);
  const outputCsv = toCsv(finalRecords);

  ensureDirectoryExists(output);
  writeFileSync(output, outputCsv, "utf8");
  console.log(`Wrote ${finalRecords.length} records to ${output}`);
}

const isMain =
  typeof process.argv[1] === "string" &&
  pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMain) {
  main();
}
