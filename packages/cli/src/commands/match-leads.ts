import { Command } from "commander";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { discoverOrganizations } from "../utils/org-discovery.js";
import { findBestMatch } from "../utils/org-matcher.js";
import type { LeadExtractionDocument } from "../validation/schemas/lead-extraction-schema.js";
import { leadExtractionDocumentSchema } from "../validation/schemas/lead-extraction-schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../../../");

const EXTRACTIONS_DIR = path.join(ROOT_DIR, "data/leads/extractions");

interface MatchedOrg {
	id: string;
	name: string;
	address: string;
}

interface ExtractionResult {
	filename: string;
	businessName: string;
	matchedOrg: MatchedOrg | null;
}

/**
 * Find all extraction JSON files
 */
function findExtractionFiles(): string[] {
	if (!fs.existsSync(EXTRACTIONS_DIR)) {
		console.error(`Extractions directory not found: ${EXTRACTIONS_DIR}`);
		return [];
	}

	const files = fs.readdirSync(EXTRACTIONS_DIR);
	return files
		.filter((file) => file.endsWith("-extraction.json"))
		.map((file) => path.join(EXTRACTIONS_DIR, file));
}

/**
 * Load and parse an extraction file
 */
function loadExtraction(filePath: string): LeadExtractionDocument | null {
	try {
		const content = fs.readFileSync(filePath, "utf-8");
		const data = JSON.parse(content);
		return leadExtractionDocumentSchema.parse(data);
	} catch (error) {
		console.error(`Error loading extraction file ${filePath}:`, error);
		return null;
	}
}

/**
 * Save extraction file with matched org information
 */
function saveExtraction(
	filePath: string,
	extraction: LeadExtractionDocument,
	matchedOrg: MatchedOrg | null,
): void {
	try {
		const updated = {
			...extraction,
			matchedOrg: matchedOrg ?? null,
		};

		const content = JSON.stringify(updated, null, 2);
		fs.writeFileSync(filePath, content, "utf-8");
	} catch (error) {
		console.error(`Error saving extraction file ${filePath}:`, error);
		throw error;
	}
}

/**
 * Format address for display
 */
function formatDisplayAddress(address: string): string {
	if (!address) return "-";
	return address;
}

/**
 * Display results in a table format
 */
function displayResults(results: ExtractionResult[]): void {
	console.log("\n=== Extraction Matching Results ===\n");

	// Calculate column widths
	let maxFilename = "Filename".length;
	let maxBusinessName = "Business Name".length;
	let maxOrgId = "Org ID".length;
	let maxOrgName = "Org Name".length;
	let maxAddress = "Address".length;

	for (const result of results) {
		maxFilename = Math.max(maxFilename, result.filename.length);
		maxBusinessName = Math.max(maxBusinessName, result.businessName.length);
		if (result.matchedOrg) {
			maxOrgId = Math.max(maxOrgId, result.matchedOrg.id.length);
			maxOrgName = Math.max(maxOrgName, result.matchedOrg.name.length);
			maxAddress = Math.max(maxAddress, result.matchedOrg.address.length);
		}
	}

	// Header
	const header = [
		"Filename".padEnd(maxFilename),
		"Business Name".padEnd(maxBusinessName),
		"Org ID".padEnd(maxOrgId),
		"Org Name".padEnd(maxOrgName),
		"Address".padEnd(maxAddress),
	].join(" | ");

	console.log(header);
	console.log("-".repeat(header.length));

	// Rows
	for (const result of results) {
		const orgId = result.matchedOrg ? result.matchedOrg.id : "NEW";
		const orgName = result.matchedOrg
			? result.matchedOrg.name
			: "-";
		const address = result.matchedOrg
			? formatDisplayAddress(result.matchedOrg.address)
			: "-";

		const row = [
			path.basename(result.filename).padEnd(maxFilename),
			result.businessName.padEnd(maxBusinessName),
			orgId.padEnd(maxOrgId),
			orgName.padEnd(maxOrgName),
			address.padEnd(maxAddress),
		].join(" | ");

		console.log(row);
	}

	// Summary
	const matchedCount = results.filter((r) => r.matchedOrg !== null).length;
	const newCount = results.length - matchedCount;

	console.log("\n=== Summary ===");
	console.log(`Total extractions: ${results.length}`);
	console.log(`Matched: ${matchedCount}`);
	console.log(`New: ${newCount}`);
}

/**
 * Match leads command
 */
export const matchLeadsCommand = new Command()
	.name("match-leads")
	.description("Match extraction files to existing organizations")
	.action(async () => {
		console.log("Discovering organizations...");
		const organizations = discoverOrganizations();
		console.log(`Found ${organizations.length} organizations`);

		console.log("\nFinding extraction files...");
		const extractionFiles = findExtractionFiles();
		console.log(`Found ${extractionFiles.length} extraction files`);

		if (extractionFiles.length === 0) {
			console.log("No extraction files found.");
			return;
		}

		console.log("\nMatching extractions to organizations...");
		const results: ExtractionResult[] = [];

		for (const filePath of extractionFiles) {
			const extraction = loadExtraction(filePath);
			if (!extraction) {
				continue;
			}

			// Get business name from business array (use first entry)
			const businessName =
				extraction.business && extraction.business.length > 0
					? extraction.business[0]!
					: "";

			if (!businessName) {
				console.warn(
					`No business name found in ${path.basename(filePath)}`,
				);
				continue;
			}

			// Find best match
			const matchedOrg = findBestMatch(businessName, organizations);

			// Save updated extraction file
			saveExtraction(filePath, extraction, matchedOrg);

			results.push({
				filename: filePath,
				businessName,
				matchedOrg,
			});
		}

		// Display results
		displayResults(results);
	});