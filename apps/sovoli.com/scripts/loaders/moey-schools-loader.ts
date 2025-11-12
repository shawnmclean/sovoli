#!/usr/bin/env tsx

/**
 * Usage:
 *   pnpm dlx tsx apps/sovoli.com/scripts/loaders/moey-schools-loader.ts \
 *     --input <path-to-transformed-csv> \
 *     --parish "<Parish or State Name>" \
 *     [--country "<Country Name>"] \
 *     [--country-code "<ISO Code>"] \
 *     [--dry-run] [--overwrite] \
 *     [--private-dir <path>] [--public-dir <path>]
 *
 * If `--input` is omitted, the script looks for a CSV at:
 *   apps/sovoli.com/data/outputs/<country>-<parish>-schools.csv
 * (with both placeholders slugified and the country segment omitted when
 * `--country` is not provided).
 */

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

interface LoaderOptions {
  input: string;
  parish: string;
  parishSlug: string;
  country: string;
  countrySlug: string;
  countryCode: string;
  privateDir: string;
  publicDir: string;
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

  const parishArg = args.get("parish");
  if (!parishArg) {
    throw new Error("Missing required --parish <name> argument.");
  }

  const parish = normalizeWhitespace(parishArg);
  const parishSlug = slugify(parish);

  const countryArg = args.get("country") ?? "Jamaica";
  const country = normalizeWhitespace(countryArg);
  const countrySlug = slugify(country);

  const countryCode = normalizeWhitespace(
    args.get("country-code") ?? (country === "Jamaica" ? "JM" : ""),
  );

  const inputArg = args.get("input");
  const defaultInputFilename = `${countrySlug ? `${countrySlug}-` : ""}${parishSlug}-schools.csv`;
  const input = inputArg
    ? resolve(process.cwd(), inputArg)
    : resolve(APPS_ROOT, `data/outputs/${defaultInputFilename}`);

  const privateDirArg = args.get("private-dir");
  const publicDirArg = args.get("public-dir");

  const privateDir = privateDirArg
    ? resolve(process.cwd(), privateDirArg)
    : resolve(
        APPS_ROOT,
        `src/modules/data/organisations/private-schools/${countrySlug}/${parishSlug}`,
      );

  const publicDir = publicDirArg
    ? resolve(process.cwd(), publicDirArg)
    : resolve(
        APPS_ROOT,
        `src/modules/data/organisations/public-schools/${countrySlug}/${parishSlug}`,
      );

  const dryRun = args.get("dry-run") === "true";
  const overwrite = args.get("overwrite") === "true";

  return {
    input,
    parish,
    parishSlug,
    country,
    countrySlug,
    countryCode,
    privateDir,
    publicDir,
    dryRun,
    overwrite,
  };
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

function splitAddress(address: string, parish: string): AddressParts {
  const cleaned = normalizeAddress(address, parish);
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

function buildModuleContent(record: RawRecord, options: LoaderOptions): string {
  const exportName = toExportName(record.schoolName);
  const categories = determineCategories(record)
    .map((category) => quote(category))
    .join(", ");
  const addressParts = splitAddress(record.address, options.parish);

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
    `          state: ${quote(options.parish)},`,
    options.countryCode
      ? `          countryCode: ${quote(options.countryCode)},`
      : undefined,
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
  const moduleContent = buildModuleContent(record, options);

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

function buildParishExportName(options: LoaderOptions, sector: Sector): string {
  const normalized = normalizeWhitespace(options.parish)
    .replace(/[^A-Za-z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .toUpperCase();

  const countryLabel = normalizeWhitespace(options.country)
    .replace(/[^A-Za-z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .toUpperCase();

  const sectorLabel = sector === "Public" ? "PUBLIC" : "PRIVATE";
  return `${normalized}_${sectorLabel}_SCHOOLS_${countryLabel || "GLOBAL"}`;
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

  ensureDir(options.privateDir);
  ensureDir(options.publicDir);

  const privateModuleList = collectModuleMetadata(options.privateDir);
  const publicModuleList = collectModuleMetadata(options.publicDir);

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
      options.privateDir,
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
      options.publicDir,
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

  const privateExportName = buildParishExportName(options, "Private");
  const publicExportName = buildParishExportName(options, "Public");

  updateParishIndex(options.privateDir, privateExportName, options);
  updateParishIndex(options.publicDir, publicExportName, options);
}

main();
