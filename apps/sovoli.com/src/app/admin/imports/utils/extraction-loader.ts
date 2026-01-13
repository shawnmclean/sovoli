import fs from "fs";
import path from "path";
import type { LeadExtractionDocument } from "../types/lead-extraction-schema";
import { leadExtractionDocumentSchema } from "../types/lead-extraction-schema";

// In Next.js, process.cwd() points to the project root (apps/sovoli.com)
// We need to go up two levels to get to the monorepo root
const ROOT_DIR = path.resolve(process.cwd(), "../..");
const EXTRACTIONS_DIR = path.join(ROOT_DIR, "data/leads/extractions");

/**
 * Get all extraction file names
 */
export function listExtractionFiles(): string[] {
	if (!fs.existsSync(EXTRACTIONS_DIR)) {
		return [];
	}

	const files = fs.readdirSync(EXTRACTIONS_DIR);
	return files
		.filter((file) => file.endsWith("-extraction.json"))
		.map((file) => file.replace("-extraction.json", ""));
}

/**
 * Load an extraction file by ID (filename without -extraction.json)
 */
export function loadExtraction(
	extractionId: string,
): LeadExtractionDocument | null {
	const filePath = path.join(
		EXTRACTIONS_DIR,
		`${extractionId}-extraction.json`,
	);

	if (!fs.existsSync(filePath)) {
		return null;
	}

	try {
		const content = fs.readFileSync(filePath, "utf-8");
		const data = JSON.parse(content);
		return leadExtractionDocumentSchema.parse(data);
	} catch (error) {
		console.error(`Error loading extraction ${extractionId}:`, error);
		return null;
	}
}

/**
 * Get extraction file metadata (filename, size, modified time, applied status)
 */
export function getExtractionMetadata(extractionId: string) {
	const filePath = path.join(
		EXTRACTIONS_DIR,
		`${extractionId}-extraction.json`,
	);

	if (!fs.existsSync(filePath)) {
		return null;
	}

	const stats = fs.statSync(filePath);
	
	// Try to read the extraction to check if it's been applied
	let isApplied = false;
	let appliedAt: string | null = null;
	try {
		const content = fs.readFileSync(filePath, "utf-8");
		const data = JSON.parse(content) as { _appliedAt?: string };
		if (data._appliedAt) {
			isApplied = true;
			appliedAt = data._appliedAt;
		}
	} catch {
		// If we can't parse, just continue without applied status
	}

	return {
		filename: `${extractionId}-extraction.json`,
		size: stats.size,
		modifiedAt: stats.mtime.toISOString(),
		isApplied,
		appliedAt,
	};
}
