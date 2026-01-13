import { Command } from "commander";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { discoverOrganizations } from "../utils/org-discovery.js";
import { findAllMatches, type ScoredMatch } from "../utils/org-matcher.js";
import {
	loadOrganizationPrograms,
	loadOrganizationCycles,
	findOrganizationDirectory,
} from "../utils/program-discovery.js";
import {
	findAllProgramMatches,
	findBestCycleMatch,
} from "../utils/program-matcher.js";
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
	score: number;
}

interface MatchedProgram {
	id: string;
	name: string;
	cycleId?: string;
	score: number;
}

interface ExtractionResult {
	filename: string;
	businessName: string;
	matchedOrgs: MatchedOrg[];
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

interface MatchedProgram {
	id: string;
	name: string;
	cycleId?: string;
}

/**
 * Save extraction file with matched org and program information
 */
function saveExtraction(
	filePath: string,
	extraction: LeadExtractionDocument,
	matchedOrgs: MatchedOrg[],
	matchedPrograms: MatchedProgram[][],
): void {
	try {
		// Update programs with matchedPrograms field (array of matches)
		const updatedPrograms = extraction.extraction.programs.map(
			(program, index) => {
				const matches = matchedPrograms[index] || [];
				return {
					...program,
					matchedPrograms: matches.length > 0 ? matches : null,
				};
			},
		);

		const updated = {
			...extraction,
			matchedOrgs: matchedOrgs.length > 0 ? matchedOrgs : null,
			extraction: {
				...extraction.extraction,
				programs: updatedPrograms,
			},
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
	let maxMatches = "Matches".length;

	for (const result of results) {
		maxFilename = Math.max(maxFilename, result.filename.length);
		maxBusinessName = Math.max(maxBusinessName, result.businessName.length);
		const matchCount = result.matchedOrgs.length;
		maxMatches = Math.max(maxMatches, matchCount.toString().length);
	}

	// Header
	const header = [
		"Filename".padEnd(maxFilename),
		"Business Name".padEnd(maxBusinessName),
		"Matches".padEnd(maxMatches),
	].join(" | ");

	console.log(header);
	console.log("-".repeat(header.length));

	// Rows
	for (const result of results) {
		const matchCount = result.matchedOrgs.length;
		const matchDisplay = matchCount > 0 ? matchCount.toString() : "NEW";

		const row = [
			path.basename(result.filename).padEnd(maxFilename),
			result.businessName.padEnd(maxBusinessName),
			matchDisplay.padEnd(maxMatches),
		].join(" | ");

		console.log(row);

		// Show matches if any
		if (result.matchedOrgs.length > 0) {
			for (const match of result.matchedOrgs) {
				console.log(
					`  → ${match.name} (${match.id}) - Score: ${match.score.toFixed(2)}`,
				);
			}
		}
	}

	// Summary
	const withMatchesCount = results.filter((r) => r.matchedOrgs.length > 0)
		.length;
	const newCount = results.length - withMatchesCount;

	console.log("\n=== Summary ===");
	console.log(`Total extractions: ${results.length}`);
	console.log(`With matches: ${withMatchesCount}`);
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

			// Find all potential organization matches (threshold: 0.5)
			const orgMatches = findAllMatches(businessName, organizations, 0.5);
			const matchedOrgs: MatchedOrg[] = orgMatches.map((m) => ({
				id: m.match.id,
				name: m.match.name,
				address: m.match.address,
				score: m.score,
			}));

			// Match programs for each potential organization match
			const matchedPrograms: MatchedProgram[][] = [];
			for (const _program of extraction.extraction.programs) {
				matchedPrograms.push([]);
			}

			// For now, match programs against the top organization match
			// (could be enhanced to match against all org matches)
			if (orgMatches.length > 0) {
				const topOrgMatch = orgMatches[0]!.match;
				const orgDir = findOrganizationDirectory(topOrgMatch.id);
				if (orgDir) {
					const orgPrograms = loadOrganizationPrograms(orgDir);
					const orgCycles = loadOrganizationCycles(orgDir);

					for (
						let i = 0;
						i < extraction.extraction.programs.length;
						i++
					) {
						const program = extraction.extraction.programs[i];
						if (!program) continue;

						const programMatches = findAllProgramMatches(
							program.name,
							orgPrograms,
							0.5,
						);

						const programMatchesWithCycles: MatchedProgram[] =
							programMatches.map((pm) => {
								const matchedCycle = findBestCycleMatch(
									pm.match.cycleIds,
									orgCycles,
								);

								return {
									id: pm.match.id,
									name: pm.match.name,
									cycleId: matchedCycle?.id,
									score: pm.score,
								};
							});

						matchedPrograms[i] = programMatchesWithCycles;
					}
				}
			}

			// Save updated extraction file
			saveExtraction(filePath, extraction, matchedOrgs, matchedPrograms);

			results.push({
				filename: filePath,
				businessName,
				matchedOrgs,
			});
		}

		// Display results
		displayResults(results);
	});