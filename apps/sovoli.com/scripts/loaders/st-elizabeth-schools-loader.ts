import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type Sector = "Public" | "Private";

interface CsvRecord {
  schoolName: string;
  address: string;
  phone: string;
  ownership: Sector;
  type: string;
  moeyCode: string;
  email: string;
}

interface SchoolModule {
  folderName: string;
  orgUsername: string;
  exportConst: string;
  schoolName: string;
  categories: string[];
  ownership: Sector;
  address: {
    line1?: string;
    line2?: string;
    line3?: string;
    city?: string;
  };
  contacts: Array<{
    type: "phone" | "email";
    value: string;
    label: "Office" | "General";
    isPublic: true;
    primary?: true;
  }>;
}

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DATA_ROOT = resolve(SCRIPT_DIR, "../../data/outputs");
const ORG_ROOT = resolve(
  SCRIPT_DIR,
  "../../src/modules/data/organisations",
);
const CSV_PATH = join(DATA_ROOT, "st-elizabeth-schools.csv");

const SECTOR_PATH: Record<Sector, string> = {
  Private: join(ORG_ROOT, "private-schools/jamaica/st-elizabeth"),
  Public: join(ORG_ROOT, "public-schools/jamaica/st-elizabeth"),
};

function main(): void {
  const csvRecords = loadCsv(CSV_PATH);
  const modules = csvRecords.map(toSchoolModule);

  const groups = groupBySector(modules);
  for (const [sector, records] of groups.entries()) {
    const baseDir = SECTOR_PATH[sector];
    mkdirSync(baseDir, { recursive: true });

    for (const record of records) {
      const moduleDir = join(baseDir, record.folderName);
      mkdirSync(moduleDir, { recursive: true });

      writeFileSync(
        join(moduleDir, "constants.ts"),
        renderConstants(record.orgUsername),
        "utf8",
      );

      writeFileSync(join(moduleDir, "index.ts"), renderModule(record), "utf8");
    }

    writeFileSync(
      join(baseDir, "index.ts"),
      renderBarrel(sector, records),
      "utf8",
    );
  }

  console.log(
    `Generated ${modules.length} St. Elizabeth school modules (private: ${groups.get("Private")?.length ?? 0}, public: ${groups.get("Public")?.length ?? 0}).`,
  );
}

function loadCsv(filePath: string): CsvRecord[] {
  const text = readFileSync(filePath, "utf8");
  const rows = parseCsv(text);
  const [header, ...dataRows] = rows;

  if (!header) {
    throw new Error("CSV is empty.");
  }

  const columns = header.map((value) => normalizeWhitespace(value));

  const requiredColumns = [
    "School Name",
    "Address",
    "Number",
    "Ownership Type",
    "Type",
    "MOEY Code",
    "Email",
  ];

  for (const column of requiredColumns) {
    if (!columns.includes(column)) {
      throw new Error(`Missing required column "${column}" in CSV header.`);
    }
  }

  const indices = Object.fromEntries(
    requiredColumns.map((c) => [c, columns.indexOf(c)]),
  ) as Record<(typeof requiredColumns)[number], number>;

  return dataRows
    .map((row) => ({
      schoolName: normalizeWhitespace(row[indices["School Name"]] ?? ""),
      address: normalizeWhitespace(row[indices.Address] ?? ""),
      phone: normalizeWhitespace(row[indices.Number] ?? ""),
      ownership: (normalizeWhitespace(row[indices["Ownership Type"]] ?? "")
        .charAt(0)
        .toUpperCase() +
        normalizeWhitespace(row[indices["Ownership Type"]] ?? "").slice(
          1,
        )) as Sector,
      type: normalizeWhitespace(row[indices.Type] ?? ""),
      moeyCode: normalizeWhitespace(row[indices["MOEY Code"]] ?? ""),
      email: normalizeWhitespace(row[indices.Email] ?? ""),
    }))
    .filter((record) => record.schoolName.length > 0);
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (char === '"') {
      const nextChar = input[i + 1];
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
      if (char === "\r" && input[i + 1] === "\n") {
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

function toSchoolModule(record: CsvRecord): SchoolModule {
  const folderName = deriveFolderName(record);
  const exportConst = deriveExportConst(record.schoolName);
  const categories = deriveCategories(record.ownership, record.type);
  const address = splitAddress(record.address);
  const contacts = buildContacts(record.phone, record.email);

  return {
    folderName,
    orgUsername: folderName,
    exportConst,
    schoolName: record.schoolName,
    categories,
    ownership: record.ownership,
    address,
    contacts,
  };
}

function deriveFolderName(record: CsvRecord): string {
  if (record.email) {
    const localPart = record.email.split("@")[0] ?? "";
    return sanitizeEmailLocal(localPart);
  }
  return record.schoolName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function sanitizeEmailLocal(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function deriveExportConst(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toUpperCase();

  return `${base}_ORG`;
}

function deriveCategories(ownership: Sector, type: string): string[] {
  const categories = [ownership === "Public" ? "public-school" : "private-school"];

  const normalizedType = type.toLowerCase();

  if (normalizedType.includes("infant") || normalizedType.includes("kindergarten")) {
    categories.push("nursery-school");
  }

  if (
    normalizedType.includes("primary") ||
    normalizedType.includes("all age") ||
    normalizedType.includes("junior high")
  ) {
    categories.push("primary-school");
  }

  if (normalizedType.includes("special")) {
    categories.push("special-education-school");
  }

  return Array.from(new Set(categories));
}

function splitAddress(rawAddress: string): SchoolModule["address"] {
  if (!rawAddress) {
    return {};
  }

  const parts = rawAddress
    .split(",")
    .map((part) => normalizeWhitespace(part))
    .filter(Boolean);

  const address: SchoolModule["address"] = {};

  if (parts[0]) address.line1 = parts[0];
  if (parts.length === 2) {
    address.city = parts[1];
  } else if (parts.length >= 3) {
    address.line2 = parts[1];
    address.city = parts[2];
    if (parts[3]) {
      address.line3 = parts.slice(3).join(", ");
    }
  }

  return address;
}

function buildContacts(phone: string, email: string): SchoolModule["contacts"] {
  const contacts: SchoolModule["contacts"] = [];

  if (phone) {
    contacts.push({
      type: "phone",
      value: formatPhone(phone),
      label: "Office",
      isPublic: true,
      primary: true,
    });
  }

  if (email) {
    contacts.push({
      type: "email",
      value: email,
      label: "General",
      isPublic: true,
    });
  }

  return contacts;
}

function formatPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 10) {
    const area = digits.slice(0, 3);
    const prefix = digits.slice(3, 6);
    const line = digits.slice(6);
    return `+1-876-${prefix}-${line}`;
  }
  if (digits.length === 7) {
    const prefix = digits.slice(0, 3);
    const line = digits.slice(3);
    return `+1-876-${prefix}-${line}`;
  }
  if (digits.length === 11 && digits.startsWith("1876")) {
    const prefix = digits.slice(4, 7);
    const line = digits.slice(7);
    return `+1-876-${prefix}-${line}`;
  }
  return rawPhone;
}

function renderConstants(username: string): string {
  return `export const ORG_USERNAME = "${username}";
`;
}

function renderModule(record: SchoolModule): string {
  const lines: string[] = [];
  lines.push(`import type { OrgInstance } from "~/modules/organisations/types";`);
  lines.push("");
  lines.push(`import { ORG_USERNAME } from "./constants";`);
  lines.push("");
  lines.push(`export const ${record.exportConst}: OrgInstance = {`);
  lines.push(`  org: {`);
  lines.push(`    username: ORG_USERNAME,`);
  lines.push(`    name: "${escapeString(record.schoolName)}",`);
  lines.push(
    `    categories: ${renderStringArray(record.categories, 4)},`,
  );
  lines.push(`    locations: [`);
  lines.push(`      {`);
  lines.push(`        key: "main-campus",`);
  lines.push(`        label: "Main Campus",`);
  lines.push(`        isPrimary: true,`);
  lines.push(`        address: ${renderAddress(record.address, 8)},`);
  lines.push(`        contacts: ${renderContacts(record.contacts, 8)},`);
  lines.push(`      },`);
  lines.push(`    ],`);
  lines.push(`  },`);
  lines.push(`  websiteModule: null,`);
  lines.push(`  academicModule: null,`);
  lines.push(`  serviceModule: null,`);
  lines.push(`  workforceModule: null,`);
  lines.push(`  scoringModule: null,`);
  lines.push(`};`);
  lines.push("");
  return lines.join("\n");
}

function renderStringArray(values: string[], indent: number): string {
  if (values.length === 0) {
    return "[]";
  }
  if (values.length === 1) {
    return `[${JSON.stringify(values[0])}]`;
  }
  const baseIndent = " ".repeat(indent);
  const items = values
    .map((value) => `${baseIndent}  ${JSON.stringify(value)},`)
    .join("\n");
  return `[\n${items}\n${baseIndent}]`;
}

function renderAddress(
  address: SchoolModule["address"],
  indent: number,
): string {
  const baseIndent = " ".repeat(indent);
  const lines: string[] = [];

  if (address.line1) {
    lines.push(`${baseIndent}  line1: "${escapeString(address.line1)}",`);
  }
  if (address.line2) {
    lines.push(`${baseIndent}  line2: "${escapeString(address.line2)}",`);
  }
  if (address.line3) {
    lines.push(`${baseIndent}  line3: "${escapeString(address.line3)}",`);
  }
  if (address.city) {
    lines.push(`${baseIndent}  city: "${escapeString(address.city)}",`);
  }
  lines.push(`${baseIndent}  state: "St. Elizabeth",`);
  lines.push(`${baseIndent}  countryCode: "JM",`);

  return `{\n${lines.join("\n")}\n${baseIndent}}`;
}

function renderContacts(
  contacts: SchoolModule["contacts"],
  indent: number,
): string {
  if (contacts.length === 0) {
    return "[]";
  }
  const baseIndent = " ".repeat(indent);
  const lines = contacts.map((contact) => {
    const contactLines = [
      `${baseIndent}  {`,
      `${baseIndent}    type: "${contact.type}",`,
      `${baseIndent}    value: "${escapeString(contact.value)}",`,
      `${baseIndent}    label: "${contact.label}",`,
      `${baseIndent}    isPublic: true,`,
    ];
    if (contact.primary) {
      contactLines.push(`${baseIndent}    primary: true,`);
    }
    contactLines.push(`${baseIndent}  },`);
    return contactLines.join("\n");
  });
  return `[\n${lines.join("\n")}\n${baseIndent}]`;
}

function escapeString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function groupBySector(records: SchoolModule[]): Map<Sector, SchoolModule[]> {
  const map = new Map<Sector, SchoolModule[]>();
  for (const record of records) {
    const list = map.get(record.ownership) ?? [];
    list.push(record);
    map.set(record.ownership, list);
  }

  for (const [sector, list] of map.entries()) {
    list.sort((a, b) => a.schoolName.localeCompare(b.schoolName));
  }

  return map;
}

function renderBarrel(sector: Sector, records: SchoolModule[]): string {
  const lines: string[] = [];
  lines.push(`import type { OrgInstance } from "~/modules/organisations/types";`);
  lines.push("");

  for (const record of records) {
    lines.push(
      `import { ${record.exportConst} } from "./${record.folderName}";`,
    );
  }

  lines.push("");
  lines.push(
    `export const ${sector === "Public" ? "ST_ELIZABETH_PUBLIC_SCHOOLS_JAMAICA" : "ST_ELIZABETH_PRIVATE_SCHOOLS_JAMAICA"}: OrgInstance[] = [`,
  );
  for (const record of records) {
    lines.push(`  ${record.exportConst},`);
  }
  lines.push("];");
  lines.push("");
  return lines.join("\n");
}

main();
#!/usr/bin/env tsx

import {
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const APPS_ROOT = resolve(SCRIPT_DIR, "../..");

const DEFAULT_INPUT_PATH = resolve(
  APPS_ROOT,
  "data/outputs/st-elizabeth-schools.csv",
);
const PRIVATE_BASE_DIR = resolve(
  APPS_ROOT,
  "src/modules/data/organisations/private-schools/jamaica/st-elizabeth",
);
const PUBLIC_BASE_DIR = resolve(
  APPS_ROOT,
  "src/modules/data/organisations/public-schools/jamaica/st-elizabeth",
);

interface LoaderOptions {
  input: string;
  dryRun: boolean;
  overwrite: boolean;
}

type Sector = "Public" | "Private";

interface RawRecord {
  schoolName: string;
  address: string;
  phone: string;
  ownership: Sector;
  type: string;
  moeyCode: string;
  email: string;
}

interface AddressParts {
  line1?: string;
  line2?: string;
  city?: string;
}

interface ModuleMeta {
  dirName: string;
  exportName: string;
  normalizedName: string | null;
}

function parseArgs(argv: string[]): LoaderOptions {
  const args = new Map<string, string>();

  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current?.startsWith("--")) {
      continue;
    }

    const key = current.slice(2);
    const next = argv[i + 1];

    if (next && !next.startsWith("--")) {
      args.set(key, next);
      i += 1;
    } else {
      args.set(key, "true");
    }
  }

  const inputArg = args.get("input");
  const input = inputArg
    ? resolve(process.cwd(), inputArg)
    : DEFAULT_INPUT_PATH;

  const dryRun = args.get("dry-run") === "true";
  const overwrite = args.get("overwrite") === "true";

  return { input, dryRun, overwrite };
}

function ensureDir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
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

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

  if (digits.length === 7) {
    return `+1-876-${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  if (digits.length === 10) {
    return `+1-${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return value.trim();
}

function loadRecords(csvPath: string): RawRecord[] {
  const csvText = readFileSync(csvPath, "utf8");
  const [header, ...rows] = parseCsv(csvText);

  if (!header) {
    throw new Error("CSV file is empty or malformed.");
  }

  const [
    schoolNameIndex,
    addressIndex,
    phoneIndex,
    ownershipIndex,
    typeIndex,
    moeyCodeIndex,
    emailIndex,
  ] = [0, 1, 2, 3, 4, 5, 6];

  return rows
    .map((row) => ({
      schoolName: normalizeWhitespace(row[schoolNameIndex] ?? ""),
      address: normalizeWhitespace(row[addressIndex] ?? ""),
      phone: normalizeWhitespace(row[phoneIndex] ?? ""),
      ownership: normalizeWhitespace(row[ownershipIndex] ?? "") as Sector,
      type: normalizeWhitespace(row[typeIndex] ?? ""),
      moeyCode: normalizeWhitespace(row[moeyCodeIndex] ?? ""),
      email: normalizeWhitespace(row[emailIndex] ?? ""),
    }))
    .filter((row) => row.schoolName);
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .trim() || "school"
  );
}

function compactSlug(value: string): string {
  return slugify(value).replace(/-/g, "");
}

function buildUsername(record: RawRecord): string {
  if (record.email) {
    const localPart = record.email.split("@")[0]?.replace(/\W+/g, "");
    if (localPart?.length) {
      return localPart.toLowerCase();
    }
  }

  const base = compactSlug(record.schoolName);
  if (base.length >= 4) {
    return base;
  }
  return `${base || "school"}${record.moeyCode ? `-${record.moeyCode}` : ""}`;
}

function toExportName(schoolName: string): string {
  const base = schoolName
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toUpperCase();
  return `${base || "SCHOOL"}_ORG`;
}

function determineCategories(record: RawRecord): string[] {
  const categories = [
    record.ownership === "Public" ? "public-school" : "private-school",
  ];
  const type = record.type.toLowerCase();

  if (
    type.includes("infant") ||
    type.includes("kindergarten") ||
    type.includes("nursery")
  ) {
    categories.push("nursery-school");
  }

  if (
    type.includes("primary") ||
    type.includes("all age") ||
    type.includes("junior high")
  ) {
    categories.push("primary-school");
  }

  if (type.includes("special")) {
    categories.push("special-education-school");
  }

  return Array.from(new Set(categories));
}

function splitAddress(address: string): AddressParts {
  const cleaned = normalizeAddress(address, "St. Elizabeth");
  if (!cleaned) {
    return {};
  }

  const segments = cleaned
    .split(",")
    .map((segment) => normalizeWhitespace(segment))
    .filter(Boolean);

  if (segments.length === 0) {
    return {};
  }

  if (segments.length === 1) {
    return { line1: segments[0] };
  }

  if (segments.length === 2) {
    const [line1, city] = segments;
    return { line1, city };
  }

  const [line1, ...rest] = segments;
  const city = rest.pop();
  const line2 = rest.join(", ");

  return { line1, line2: line2 || undefined, city };
}

function quote(value: string): string {
  return JSON.stringify(value);
}

function buildContacts(record: RawRecord) {
  const contacts: string[] = [];
  const phone = normalizePhone(record.phone);
  const email = record.email;

  if (phone) {
    contacts.push(
      [
        "          {",
        `            type: "phone",`,
        `            value: ${quote(phone)},`,
        `            label: "Office",`,
        `            isPublic: true,`,
        `            primary: true,`,
        "          },",
      ].join("\n"),
    );
  }

  if (email) {
    contacts.push(
      [
        "          {",
        `            type: "email",`,
        `            value: ${quote(email)},`,
        `            label: "General",`,
        `            isPublic: true,`,
        contacts.length === 0 ? "            primary: true," : undefined,
        "          },",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  if (contacts.length === 0) {
    return "        contacts: [],";
  }

  return ["        contacts: [", contacts.join("\n"), "        ],"].join("\n");
}

function buildModuleContent(record: RawRecord): string {
  const exportName = toExportName(record.schoolName);
  const categories = determineCategories(record)
    .map((category) => quote(category))
    .join(", ");
  const addressParts = splitAddress(record.address);

  const addressLines: string[] = [
    "        address: {",
    addressParts.line1
      ? `          line1: ${quote(addressParts.line1)},`
      : undefined,
    addressParts.line2
      ? `          line2: ${quote(addressParts.line2)},`
      : undefined,
    addressParts.city
      ? `          city: ${quote(addressParts.city)},`
      : undefined,
    `          state: "St. Elizabeth",`,
    `          countryCode: "JM",`,
    "        },",
  ].filter(Boolean) as string[];

  const contactsBlock = buildContacts(record);

  return [
    `import type { OrgInstance } from "~/modules/organisations/types";`,
    "",
    `import { ORG_USERNAME } from "./constants";`,
    "",
    `export const ${exportName}: OrgInstance = {`,
    "  org: {",
    "    username: ORG_USERNAME,",
    `    name: ${quote(record.schoolName)},`,
    `    categories: [${categories}],`,
    "    locations: [",
    "      {",
    '        key: "main-campus",',
    '        label: "Main Campus",',
    "        isPrimary: true,",
    ...addressLines,
    contactsBlock,
    "      },",
    "    ],",
    "  },",
    "  websiteModule: null,",
    "  academicModule: null,",
    "  serviceModule: null,",
    "  workforceModule: null,",
    "  scoringModule: null,",
    "};",
    "",
  ].join("\n");
}

function buildConstantsContent(username: string): string {
  return [`export const ORG_USERNAME = ${quote(username)};`, "", ""].join("\n");
}

function normalizeName(value: string): string {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function buildNameCandidates(record: RawRecord): string[] {
  const candidates = new Set<string>();
  const base = normalizeName(record.schoolName);
  if (base) {
    candidates.add(base);
  }

  const appendedVariants = [
    `${record.schoolName} School`,
    `${record.schoolName} Primary School`,
    `${record.schoolName} High School`,
    `${record.schoolName} College`,
  ];

  for (const variant of appendedVariants) {
    const normalized = normalizeName(variant);
    if (normalized) {
      candidates.add(normalized);
    }
  }

  return Array.from(candidates);
}

function writeModule(
  baseDir: string,
  record: RawRecord,
  options: LoaderOptions,
  existingByExport: Map<string, ModuleMeta>,
  existingByName: Map<string, ModuleMeta>,
): ModuleMeta | null {
  const username = buildUsername(record);
  const exportName = toExportName(record.schoolName);
  let existingModule = existingByExport.get(exportName);

  if (!existingModule) {
    for (const candidate of buildNameCandidates(record)) {
      const match = existingByName.get(candidate);
      if (match) {
        existingModule = match;
        break;
      }
    }
  }

  if (existingModule && !options.overwrite) {
    console.info(`Skipping existing module: ${record.schoolName}`);
    return existingModule;
  }

  const dirName = existingModule ? existingModule.dirName : slugify(username);
  const moduleDir = join(baseDir, dirName);

  if (!options.dryRun) {
    ensureDir(moduleDir);
  }

  const constantsPath = join(moduleDir, "constants.ts");
  const modulePath = join(moduleDir, "index.ts");

  const constantsContent = buildConstantsContent(username);
  const moduleContent = buildModuleContent(record);

  if (options.dryRun) {
    console.info(`[dry-run] Would write module for ${record.schoolName}`);
    return {
      dirName,
      exportName,
      normalizedName: normalizeName(record.schoolName),
    };
  }

  writeFileSync(constantsPath, constantsContent, "utf8");
  writeFileSync(modulePath, moduleContent, "utf8");

  console.log(`Generated module for ${record.schoolName}`);

  return {
    dirName,
    exportName,
    normalizedName: normalizeName(record.schoolName),
  };
}

function parseModuleExportName(modulePath: string): string | null {
  if (!existsSync(modulePath)) {
    return null;
  }

  const content = readFileSync(modulePath, "utf8");
  const regexp = /export const (\w+)/;
  const result = regexp.exec(content);
  return result?.[1] ?? null;
}

function extractOrgName(content: string): string | null {
  const regexp = /org:\s*{\s*[\s\S]*?name:\s*"([^"]+)"/;
  const result = regexp.exec(content);
  return result?.[1] ?? null;
}

function collectModuleMetadata(baseDir: string): ModuleMeta[] {
  const entries = readdirSync(baseDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const modulePath = join(baseDir, entry.name, "index.ts");
      const exportName = parseModuleExportName(modulePath);
      if (!exportName) {
        console.warn(
          `Skipping ${entry.name} - unable to determine exported constant.`,
        );
        return null;
      }
      const content = readFileSync(modulePath, "utf8");
      const orgName = extractOrgName(content);
      return {
        dirName: entry.name,
        exportName,
        normalizedName: orgName ? normalizeName(orgName) : null,
      };
    })
    .filter((entry): entry is ModuleMeta => Boolean(entry))
    .sort((a, b) => a.exportName.localeCompare(b.exportName));
}

function buildIndexContent(exportName: string, modules: ModuleMeta[]): string {
  const imports = modules.map(
    (meta) => `import { ${meta.exportName} } from "./${meta.dirName}";`,
  );

  const arrayEntries = modules.map((meta) => `  ${meta.exportName},`);

  const lines = [
    `import type { OrgInstance } from "~/modules/organisations/types";`,
    "",
  ];

  if (imports.length) {
    lines.push(...imports, "");
  }

  lines.push(
    `export const ${exportName}: OrgInstance[] = [`,
    ...arrayEntries,
    "];",
    "",
  );

  return lines.join("\n");
}

function updateParishIndex(
  baseDir: string,
  exportName: string,
  options: LoaderOptions,
) {
  const modules = collectModuleMetadata(baseDir);
  const indexPath = join(baseDir, "index.ts");
  const content = buildIndexContent(exportName, modules);

  if (options.dryRun) {
    console.info(`[dry-run] Would update index at ${indexPath}`);
    return;
  }

  writeFileSync(indexPath, content, "utf8");
  console.log(`Updated index: ${indexPath}`);
}

function main() {
  const options = parseArgs(process.argv);
  const records = loadRecords(options.input);

  if (!records.length) {
    console.warn("No records found to process.");
    return;
  }

  const privateRecords = records.filter(
    (record) => record.ownership === "Private",
  );
  const publicRecords = records.filter(
    (record) => record.ownership === "Public",
  );

  if (!privateRecords.length && !publicRecords.length) {
    console.warn("No public or private school records detected.");
    return;
  }

  ensureDir(PRIVATE_BASE_DIR);
  ensureDir(PUBLIC_BASE_DIR);

  const privateModuleList = collectModuleMetadata(PRIVATE_BASE_DIR);
  const publicModuleList = collectModuleMetadata(PUBLIC_BASE_DIR);

  const existingPrivateByExport = new Map(
    privateModuleList.map((meta) => [meta.exportName, meta]),
  );
  const existingPrivateByName = new Map<string, ModuleMeta>();
  for (const meta of privateModuleList) {
    if (meta.normalizedName) {
      existingPrivateByName.set(meta.normalizedName, meta);
    }
  }

  const existingPublicByExport = new Map(
    publicModuleList.map((meta) => [meta.exportName, meta]),
  );
  const existingPublicByName = new Map<string, ModuleMeta>();
  for (const meta of publicModuleList) {
    if (meta.normalizedName) {
      existingPublicByName.set(meta.normalizedName, meta);
    }
  }

  for (const record of privateRecords) {
    const meta = writeModule(
      PRIVATE_BASE_DIR,
      record,
      options,
      existingPrivateByExport,
      existingPrivateByName,
    );
    if (meta) {
      existingPrivateByExport.set(meta.exportName, meta);
      if (meta.normalizedName) {
        existingPrivateByName.set(meta.normalizedName, meta);
      }
    }
  }

  for (const record of publicRecords) {
    const meta = writeModule(
      PUBLIC_BASE_DIR,
      record,
      options,
      existingPublicByExport,
      existingPublicByName,
    );
    if (meta) {
      existingPublicByExport.set(meta.exportName, meta);
      if (meta.normalizedName) {
        existingPublicByName.set(meta.normalizedName, meta);
      }
    }
  }

  updateParishIndex(
    PRIVATE_BASE_DIR,
    "ST_ELIZABETH_PRIVATE_SCHOOLS_JAMAICA",
    options,
  );
  updateParishIndex(
    PUBLIC_BASE_DIR,
    "ST_ELIZABETH_PUBLIC_SCHOOLS_JAMAICA",
    options,
  );
}

main();
