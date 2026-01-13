import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../../../");

/**
 * Organization information extracted from org.json files
 */
export interface OrgInfo {
	id: string;
	name: string;
	address: string;
}

/**
 * Recursively find all directories containing org.json files
 */
function findOrgDirectories(dir: string, orgDirs: string[] = []): string[] {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			// Check if this directory contains org.json
			const orgJsonPath = path.join(fullPath, "org.json");
			if (fs.existsSync(orgJsonPath)) {
				orgDirs.push(fullPath);
			} else {
				// Recurse into subdirectories
				findOrgDirectories(fullPath, orgDirs);
			}
		}
	}

	return orgDirs;
}

/**
 * Format address from org location address object
 */
function formatAddress(address: {
	line1?: string;
	line2?: string;
	line3?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	countryCode: string;
}): string {
	const parts: string[] = [];

	if (address.line1) parts.push(address.line1);
	if (address.line2) parts.push(address.line2);
	if (address.line3) parts.push(address.line3);
	if (address.city) parts.push(address.city);
	if (address.state) parts.push(address.state);
	if (address.postalCode) parts.push(address.postalCode);
	if (address.countryCode) parts.push(address.countryCode);

	return parts.join(", ") || "";
}

/**
 * Load organization information from org.json file
 */
function loadOrgFromFile(orgDir: string): OrgInfo | null {
	const orgJsonPath = path.join(orgDir, "org.json");

	try {
		const orgJsonContent = fs.readFileSync(orgJsonPath, "utf-8");
		const orgData = JSON.parse(orgJsonContent) as {
			username: string;
			name: string;
			locations?: Array<{
				isPrimary?: boolean;
				address: {
					line1?: string;
					line2?: string;
					line3?: string;
					city?: string;
					state?: string;
					postalCode?: string;
					countryCode: string;
				};
			}>;
		};

		// Get organization ID (username)
		const id = orgData.username;

		// Get organization name
		const name = orgData.name;

		// Get primary location address, or first location if no primary
		let address = "";
		if (orgData.locations && orgData.locations.length > 0) {
			const primaryLocation =
				orgData.locations.find((loc) => loc.isPrimary) ||
				orgData.locations[0];
			if (primaryLocation) {
				address = formatAddress(primaryLocation.address);
			}
		}

		return { id, name, address };
	} catch (error) {
		console.error(`Error loading org from ${orgJsonPath}:`, error);
		return null;
	}
}

/**
 * Discover all organizations by scanning the organisations directory
 */
export function discoverOrganizations(): OrgInfo[] {
	const orgsDir = path.join(
		ROOT_DIR,
		"apps/sovoli.com/src/modules/data/organisations",
	);

	if (!fs.existsSync(orgsDir)) {
		console.warn(`Organisations directory not found: ${orgsDir}`);
		return [];
	}

	const orgDirs = findOrgDirectories(orgsDir);
	const organizations: OrgInfo[] = [];

	for (const orgDir of orgDirs) {
		const orgInfo = loadOrgFromFile(orgDir);
		if (orgInfo) {
			organizations.push(orgInfo);
		}
	}

	return organizations;
}