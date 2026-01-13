import fs from "fs";
import path from "path";
import type { MatchedProgram } from "../types/lead-extraction-schema";

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
 * Load all programs from an organization directory
 */
export function loadAllPrograms(orgDir: string): Array<{ id: string; name: string }> {
	const programs: Array<{ id: string; name: string }> = [];
	const programsMap = new Map<string, { id: string; name: string }>();

	if (!fs.existsSync(orgDir)) {
		return [];
	}

	try {
		const files = fs.readdirSync(orgDir);
		const academicFiles = files.filter(
			(file) => file.endsWith("-academic.json") || file === "academic.json",
		);

		for (const academicFile of academicFiles) {
			const academicPath = path.join(orgDir, academicFile);
			try {
				const content = fs.readFileSync(academicPath, "utf-8");
				const data = JSON.parse(content) as {
					programs?: Array<{
						id: string;
						name?: string;
					}>;
				};

				if (data.programs) {
					for (const program of data.programs) {
						if (program.id && program.name && !programsMap.has(program.id)) {
							programsMap.set(program.id, {
								id: program.id,
								name: program.name,
							});
						}
					}
				}
			} catch (error) {
				// Continue to next file
				continue;
			}
		}
	} catch (error) {
		console.warn(`Error loading programs from ${orgDir}:`, error);
	}

	return Array.from(programsMap.values());
}

/**
 * Match extraction program to existing program
 * Returns the matched program data if found, null otherwise
 */
export function matchProgram(
	orgDir: string,
	matchedPrograms: MatchedProgram[] | null | undefined,
): {
	programId: string;
	programData: Record<string, unknown>;
} | null {
	if (!matchedPrograms || matchedPrograms.length === 0) {
		return null;
	}

	// Use the first matched program (highest score)
	const matchedProgram = matchedPrograms[0];
	if (!matchedProgram) {
		return null;
	}

	const programData = loadProgramFile(orgDir, matchedProgram.id);
	if (!programData) {
		return null;
	}

	return {
		programId: matchedProgram.id,
		programData,
	};
}
