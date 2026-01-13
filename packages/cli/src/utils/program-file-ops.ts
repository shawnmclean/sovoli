import fs from "fs";
import path from "path";
import { findOrganizationDirectory } from "./program-discovery.js";
import { loadOrganizationPrograms } from "./program-discovery.js";
import type { ChangeMetadata } from "./change-tracking.js";

/**
 * Find which academic file contains a program
 */
function findProgramFile(
	orgDir: string,
	programId: string,
): { filePath: string; programs: Array<Record<string, unknown>> } | null {
	// Try to find in any academic JSON file
	const files = fs.readdirSync(orgDir);
	const academicFiles = files.filter(
		(file) => file.endsWith("-academic.json") || file === "academic.json",
	);

	for (const academicFile of academicFiles) {
		const academicPath = path.join(orgDir, academicFile);
		try {
			const content = fs.readFileSync(academicPath, "utf-8");
			const data = JSON.parse(content) as {
				programs?: Array<Record<string, unknown>>;
			};

			if (data.programs) {
				const program = data.programs.find(
					(p) => (p.id as string) === programId,
				);
				if (program) {
					return { filePath: academicPath, programs: data.programs };
				}
			}
		} catch (error) {
			// Continue to next file
			continue;
		}
	}

	return null;
}

/**
 * Load program from academic JSON files
 */
export function loadProgramFile(
	orgDir: string,
	programId: string,
): Record<string, unknown> | null {
	const result = findProgramFile(orgDir, programId);
	if (!result) {
		return null;
	}

	const program = result.programs.find(
		(p) => (p.id as string) === programId,
	);

	return program ? (program as Record<string, unknown>) : null;
}

/**
 * Save program to academic JSON file with change tracking metadata
 */
export function saveProgramFile(
	orgDir: string,
	programId: string,
	programData: Record<string, unknown>,
	changes: ChangeMetadata,
): void {
	const result = findProgramFile(orgDir, programId);
	if (!result) {
		throw new Error(`Program ${programId} not found in any academic file`);
	}

	// Apply change tracking metadata
	const programWithMetadata = { ...programData };

	if (changes.isNew) {
		(programWithMetadata as { _addedAt?: string })._addedAt =
			changes.timestamp;
		(programWithMetadata as { _source?: string })._source = changes.source;
	} else {
		(programWithMetadata as { _updatedAt?: string })._updatedAt =
			changes.timestamp;
		(programWithMetadata as { _updatedFields?: string[] })._updatedFields =
			changes.updatedFields;
		(programWithMetadata as { _source?: string })._source = changes.source;
	}

	// Update program in programs array
	const updatedPrograms = result.programs.map((p) => {
		if ((p.id as string) === programId) {
			return programWithMetadata;
		}
		return p;
	});

	// Write back to file
	const updatedData = {
		programs: updatedPrograms,
	};

	const content = JSON.stringify(updatedData, null, 2) + "\n";
	fs.writeFileSync(result.filePath, content, "utf-8");
}

/**
 * Apply changes to program data and add metadata
 */
export function applyProgramChanges(
	programData: Record<string, unknown>,
	updates: Record<string, unknown>,
	changes: ChangeMetadata,
): Record<string, unknown> {
	// Merge updates into program data
	const updated = { ...programData, ...updates };

	// Apply change tracking metadata
	if (changes.isNew) {
		(updated as { _addedAt?: string })._addedAt = changes.timestamp;
		(updated as { _source?: string })._source = changes.source;
	} else {
		(updated as { _updatedAt?: string })._updatedAt = changes.timestamp;
		(updated as { _updatedFields?: string[] })._updatedFields =
			changes.updatedFields;
		(updated as { _source?: string })._source = changes.source;
	}

	return updated;
}

/**
 * Create new program in appropriate academic file
 */
export function createNewProgram(
	orgDir: string,
	programData: Record<string, unknown>,
	source: string,
): void {
	// Determine which academic file to use
	// Try to find program-groups.json to determine group
	let targetFile = "academic.json";
	const programGroupsPath = path.join(orgDir, "program-groups.json");

	if (fs.existsSync(programGroupsPath)) {
		try {
			const content = fs.readFileSync(programGroupsPath, "utf-8");
			const data = JSON.parse(content) as {
				groups?: Array<{ id: string; slug: string }>;
			};

			if (data.groups && data.groups.length > 0) {
				// Use first group as default
				const firstGroup = data.groups[0];
				if (firstGroup) {
					targetFile = `${firstGroup.slug}-academic.json`;
				}
			}
		} catch (error) {
			// Fall back to default
		}
	}

	const academicPath = path.join(orgDir, targetFile);

	// Load or create academic file
	let programs: Array<Record<string, unknown>> = [];
	if (fs.existsSync(academicPath)) {
		try {
			const content = fs.readFileSync(academicPath, "utf-8");
			const data = JSON.parse(content) as {
				programs?: Array<Record<string, unknown>>;
			};
			programs = data.programs || [];
		} catch (error) {
			// Start with empty array
		}
	}

	// Add metadata to new program
	const programWithMetadata = {
		...programData,
		_addedAt: new Date().toISOString(),
		_source: source,
	};

	// Add program to array
	programs.push(programWithMetadata);

	// Write back to file
	const updatedData = {
		programs,
	};

	const content = JSON.stringify(updatedData, null, 2) + "\n";
	fs.writeFileSync(academicPath, content, "utf-8");
}
