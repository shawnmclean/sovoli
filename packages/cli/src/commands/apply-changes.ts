import { Command } from "commander";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { leadExtractionDocumentSchema } from "../validation/schemas/lead-extraction-schema.js";
import type { LeadExtractionDocument, MatchedOrg, MatchedProgram } from "../validation/schemas/lead-extraction-schema.js";
import { promptOrgAction, promptSelectOrg, promptNewOrgDetails, promptProgramAction, promptSelectProgram, promptConfirmChanges } from "../utils/prompts.js";
import { displayOrgDiff, displayProgramDiff } from "../utils/diff-display.js";
import { loadOrgFile, saveOrgFile, createNewOrg, applyOrgChanges } from "../utils/org-file-ops.js";
import { loadProgramFile, saveProgramFile, createNewProgram, applyProgramChanges } from "../utils/program-file-ops.js";
import { transformExtractionToOrgUpdates, transformExtractionToProgramUpdates, trackChanges } from "../utils/extraction-transform.js";
import { findOrganizationDirectory } from "../utils/program-discovery.js";
import type { ChangeMetadata } from "../utils/change-tracking.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../../../");

const EXTRACTIONS_DIR = path.join(ROOT_DIR, "data/leads/extractions");

/**
 * Pending change for an organization
 */
interface PendingOrgChange {
	type: "update" | "create";
	orgId: string;
	orgDir: string;
	orgName: string;
	oldOrg?: Record<string, unknown>;
	newOrg: Record<string, unknown>;
	changes: ChangeMetadata;
	extractionFilename: string;
	// For new orgs only
	category?: string;
	country?: string;
	region?: string;
}

/**
 * Pending change for a program
 */
interface PendingProgramChange {
	type: "update" | "create";
	programId: string;
	programName: string;
	orgDir: string;
	oldProgram?: Record<string, unknown>;
	newProgram: Record<string, unknown>;
	changes: ChangeMetadata;
	extractionFilename: string;
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
 * Process organization updates (dry-run mode - returns pending change)
 */
async function processOrg(
	extraction: LeadExtractionDocument,
	extractionFilename: string,
): Promise<PendingOrgChange | null> {
	const businessName =
		extraction.business && extraction.business.length > 0
			? extraction.business[0]!
			: "Unknown Business";

	const matchedOrgs = extraction.matchedOrgs || null;

	// Prompt for org action
	const action = await promptOrgAction(matchedOrgs, businessName);

	if (action === "skip") {
		return null;
	}

	if (action === "use" && matchedOrgs && matchedOrgs.length > 0) {
		// Select which org to use
		const selectedOrg = await promptSelectOrg(matchedOrgs);
		if (!selectedOrg) {
			return null;
		}

		// Load existing org
		const orgDir = findOrganizationDirectory(selectedOrg.id);
		if (!orgDir) {
			console.error(`Organization directory not found for ${selectedOrg.id}`);
			return null;
		}

		const existingOrg = loadOrgFile(selectedOrg.id);
		if (!existingOrg) {
			console.error(`Failed to load org.json for ${selectedOrg.id}`);
			return null;
		}

		// Transform extraction to org updates
		const updates = transformExtractionToOrgUpdates(extraction);

		// Merge updates
		const updatedOrg = applyOrgChanges(existingOrg, updates, {
			source: extractionFilename,
			timestamp: new Date().toISOString(),
			updatedFields: Object.keys(updates),
			isNew: false,
		});

		// Show diff
		displayOrgDiff(existingOrg, updatedOrg);

		// Confirm changes
		const confirmed = await promptConfirmChanges(
			`Apply changes to organization "${selectedOrg.name}"?`,
		);

		if (!confirmed) {
			console.log("Skipping organization update.");
			return null;
		}

		// Track changes properly
		const changes = trackChanges(existingOrg, updatedOrg, extractionFilename);
		const finalOrg = applyOrgChanges(existingOrg, updates, changes);

		return {
			type: "update",
			orgId: selectedOrg.id,
			orgDir,
			orgName: selectedOrg.name,
			oldOrg: existingOrg,
			newOrg: finalOrg,
			changes,
			extractionFilename,
		};
	}

	if (action === "create") {
		// Prompt for new org details
		const orgDetails = await promptNewOrgDetails(businessName);

		// Transform extraction to org data
		const orgUpdates = transformExtractionToOrgUpdates(extraction);

		// Create base org data
		const newOrgData = {
			username: orgDetails.username,
			name: businessName,
			categories: [orgDetails.category],
			locations: orgUpdates.locations || [],
			socialLinks: orgUpdates.socialLinks || [],
		};

		// Show what will be created
		console.log("\n📊 New Organization:");
		console.log("=".repeat(50));
		console.log(JSON.stringify(newOrgData, null, 2));
		console.log("=".repeat(50));

		// Confirm creation
		const confirmed = await promptConfirmChanges(
			`Create new organization "${businessName}"?`,
		);

		if (!confirmed) {
			console.log("Skipping organization creation.");
			return null;
		}

		// Determine org directory path
		const pathParts = [orgDetails.category, orgDetails.country];
		if (orgDetails.region) {
			pathParts.push(orgDetails.region);
		}
		pathParts.push(orgDetails.username);
		const orgDir = path.join(
			ROOT_DIR,
			"apps/sovoli.com/src/modules/data/organisations",
			...pathParts,
		);

		const changes: ChangeMetadata = {
			source: extractionFilename,
			timestamp: new Date().toISOString(),
			updatedFields: [],
			isNew: true,
		};

		return {
			type: "create",
			orgId: orgDetails.username,
			orgDir,
			orgName: businessName,
			newOrg: newOrgData,
			changes,
			extractionFilename,
			category: orgDetails.category,
			country: orgDetails.country,
			region: orgDetails.region,
		};
	}

	return null;
}

/**
 * Process program updates (dry-run mode - returns pending change)
 */
async function processProgram(
	programEvidence: {
		id: string;
		name: string;
		matchedPrograms: MatchedProgram[] | null;
		[key: string]: unknown;
	},
	orgDir: string,
	extractionFilename: string,
): Promise<PendingProgramChange | null> {
	const matchedPrograms = programEvidence.matchedPrograms || null;

	// Prompt for program action
	const action = await promptProgramAction(programEvidence.name, matchedPrograms);

	if (action === "skip") {
		return null;
	}

	if (action === "update" && matchedPrograms && matchedPrograms.length > 0) {
		// Select which program to update
		const selectedProgram = await promptSelectProgram(matchedPrograms);
		if (!selectedProgram) {
			return null;
		}

		// Load existing program
		const existingProgram = loadProgramFile(orgDir, selectedProgram.id);
		if (!existingProgram) {
			console.error(`Failed to load program ${selectedProgram.id}`);
			return null;
		}

		// Transform extraction to program updates
		const updates = transformExtractionToProgramUpdates(programEvidence);

		// Merge updates
		const updatedProgram = applyProgramChanges(
			existingProgram,
			updates,
			{
				source: extractionFilename,
				timestamp: new Date().toISOString(),
				updatedFields: Object.keys(updates),
				isNew: false,
			},
		);

		// Show diff
		displayProgramDiff(existingProgram, updatedProgram);

		// Confirm changes
		const confirmed = await promptConfirmChanges(
			`Apply changes to program "${selectedProgram.name}"?`,
		);

		if (!confirmed) {
			console.log("Skipping program update.");
			return null;
		}

		// Track changes properly
		const changes = trackChanges(existingProgram, updatedProgram, extractionFilename);
		const finalProgram = applyProgramChanges(existingProgram, updates, changes);

		return {
			type: "update",
			programId: selectedProgram.id,
			programName: selectedProgram.name,
			orgDir,
			oldProgram: existingProgram,
			newProgram: finalProgram,
			changes,
			extractionFilename,
		};
	} else if (action === "create") {
		// Transform extraction to program data
		const programUpdates = transformExtractionToProgramUpdates(programEvidence);

		// Create base program data
		const newProgramData = {
			id: programEvidence.id,
			slug: programEvidence.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
			name: programEvidence.name,
			...programUpdates,
		};

		// Show what will be created
		console.log("\n📊 New Program:");
		console.log("=".repeat(50));
		console.log(JSON.stringify(newProgramData, null, 2));
		console.log("=".repeat(50));

		// Confirm creation
		const confirmed = await promptConfirmChanges(
			`Create new program "${programEvidence.name}"?`,
		);

		if (!confirmed) {
			console.log("Skipping program creation.");
			return null;
		}

		const changes: ChangeMetadata = {
			source: extractionFilename,
			timestamp: new Date().toISOString(),
			updatedFields: [],
			isNew: true,
		};

		return {
			type: "create",
			programId: programEvidence.id,
			programName: programEvidence.name,
			orgDir,
			newProgram: newProgramData,
			changes,
			extractionFilename,
		};
	}

	return null;
}

/**
 * Display summary of pending changes
 */
function displaySummary(
	pendingOrgChanges: PendingOrgChange[],
	pendingProgramChanges: PendingProgramChange[],
): void {
	console.log("\n" + "=".repeat(60));
	console.log("📋 DRY-RUN SUMMARY");
	console.log("=".repeat(60));

	if (pendingOrgChanges.length === 0 && pendingProgramChanges.length === 0) {
		console.log("\nNo changes to apply.");
		return;
	}

	// Organizations
	if (pendingOrgChanges.length > 0) {
		console.log(`\n📁 Organizations (${pendingOrgChanges.length}):`);
		for (const change of pendingOrgChanges) {
			if (change.type === "update") {
				console.log(`  ✅ UPDATE: ${change.orgName} (${change.orgId})`);
				console.log(`     Source: ${change.extractionFilename}`);
				console.log(`     Updated fields: ${change.changes.updatedFields.join(", ") || "none"}`);
			} else {
				console.log(`  ➕ CREATE: ${change.orgName} (${change.orgId})`);
				console.log(`     Source: ${change.extractionFilename}`);
				console.log(`     Directory: ${change.orgDir}`);
			}
		}
	}

	// Programs
	if (pendingProgramChanges.length > 0) {
		console.log(`\n📚 Programs (${pendingProgramChanges.length}):`);
		for (const change of pendingProgramChanges) {
			if (change.type === "update") {
				console.log(`  ✅ UPDATE: ${change.programName} (${change.programId})`);
				console.log(`     Source: ${change.extractionFilename}`);
				console.log(`     Updated fields: ${change.changes.updatedFields.join(", ") || "none"}`);
			} else {
				console.log(`  ➕ CREATE: ${change.programName} (${change.programId})`);
				console.log(`     Source: ${change.extractionFilename}`);
			}
		}
	}

	console.log("\n" + "=".repeat(60));
}

/**
 * Apply all pending changes
 */
function applyPendingChanges(
	pendingOrgChanges: PendingOrgChange[],
	pendingProgramChanges: PendingProgramChange[],
): void {
	// Apply org changes
	for (const change of pendingOrgChanges) {
		if (change.type === "update") {
			saveOrgFile(change.orgId, change.newOrg, change.changes);
			console.log(`✅ Updated organization: ${change.orgName}`);
		} else {
			// Create new org
			if (!change.category || !change.country) {
				console.error(`Missing category or country for org ${change.orgId}`);
				continue;
			}

			createNewOrg(
				change.newOrg,
				change.category,
				change.country,
				change.region,
				change.extractionFilename,
			);
			console.log(`✅ Created organization: ${change.orgName}`);
			console.log(`   Directory: ${change.orgDir}`);
		}
	}

	// Apply program changes
	for (const change of pendingProgramChanges) {
		if (change.type === "update") {
			saveProgramFile(
				change.orgDir,
				change.programId,
				change.newProgram,
				change.changes,
			);
			console.log(`✅ Updated program: ${change.programName}`);
		} else {
			createNewProgram(change.orgDir, change.newProgram, change.extractionFilename);
			console.log(`✅ Created program: ${change.programName}`);
		}
	}
}

/**
 * Apply changes command
 */
export const applyChangesCommand = new Command()
	.name("apply-changes")
	.description("Apply extraction data to organizations and programs")
	.action(async () => {
		console.log("Finding extraction files...");
		const extractionFiles = findExtractionFiles();
		console.log(`Found ${extractionFiles.length} extraction files`);

		if (extractionFiles.length === 0) {
			console.log("No extraction files found.");
			return;
		}

		const pendingOrgChanges: PendingOrgChange[] = [];
		const pendingProgramChanges: PendingProgramChange[] = [];

		// Process each extraction file (dry-run mode)
		for (const filePath of extractionFiles) {
			const extraction = loadExtraction(filePath);
			if (!extraction) {
				console.warn(`Skipping ${path.basename(filePath)} (failed to load)`);
				continue;
			}

			const extractionFilename = path.basename(filePath);

			console.log(`\n${"=".repeat(60)}`);
			console.log(`Processing: ${extractionFilename}`);
			console.log("=".repeat(60));

			// Process organization
			const orgChange = await processOrg(extraction, extractionFilename);

			if (!orgChange) {
				console.log("Skipping programs (no organization selected/created).");
				continue;
			}

			// Add org change to pending
			pendingOrgChanges.push(orgChange);

			// Process each program
			for (const program of extraction.extraction.programs) {
				const programChange = await processProgram(
					{
						...program,
						matchedPrograms: program.matchedPrograms || null,
					},
					orgChange.orgDir,
					extractionFilename,
				);

				if (programChange) {
					pendingProgramChanges.push(programChange);
				}
			}
		}

		// Display summary
		displaySummary(pendingOrgChanges, pendingProgramChanges);

		// Final confirmation
		if (pendingOrgChanges.length > 0 || pendingProgramChanges.length > 0) {
			const confirmed = await promptConfirmChanges(
				"\nApply all changes?",
			);

			if (!confirmed) {
				console.log("\n❌ Changes cancelled. No files were modified.");
				return;
			}

			// Apply all changes
			console.log("\n💾 Applying changes...");
			applyPendingChanges(pendingOrgChanges, pendingProgramChanges);
			console.log("\n✅ All changes applied!");
		} else {
			console.log("\n✅ No changes to apply.");
		}
	});
