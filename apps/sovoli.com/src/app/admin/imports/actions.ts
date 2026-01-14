"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { getChangedFields } from "./utils/change-tracking";
import type { ChangeMetadata } from "./utils/change-tracking";
import {
  extractStartDate,
  calculateEndDate,
  generateCycleId,
  transformPricingToPackage,
} from "./utils/cycle-utils";
import type { ProgramEvidence } from "./types/lead-extraction-schema";

// In Next.js, process.cwd() points to the project root (apps/sovoli.com)
// We need to go up two levels to get to the monorepo root
const ROOT_DIR = path.resolve(process.cwd(), "../..");
const ORGS_DIR = path.join(
  ROOT_DIR,
  "apps/sovoli.com/src/modules/data/organisations",
);

/**
 * Find organization directory from org ID (username)
 */
function findOrganizationDirectory(orgId: string): string | null {
  if (!fs.existsSync(ORGS_DIR)) {
    return null;
  }

  // Recursively search for org directory
  function searchDirectory(dir: string): string | null {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        const orgJsonPath = path.join(fullPath, "org.json");

        if (fs.existsSync(orgJsonPath)) {
          try {
            const content = fs.readFileSync(orgJsonPath, "utf-8");
            const orgData = JSON.parse(content) as {
              username: string;
            };

            if (orgData.username === orgId) {
              return fullPath;
            }
          } catch {
            // Continue searching
          }
        }

        // Recurse into subdirectories
        const found = searchDirectory(fullPath);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  return searchDirectory(ORGS_DIR);
}

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
 * Load cycles.json file
 */
function loadCyclesFile(orgDir: string): {
  globalCycles: Array<Record<string, unknown>>;
  academicCycles: Array<Record<string, unknown>>;
  programCycles: Array<Record<string, unknown>>;
} {
  const cyclesPath = path.join(orgDir, "cycles.json");
  if (!fs.existsSync(cyclesPath)) {
    return {
      globalCycles: [],
      academicCycles: [],
      programCycles: [],
    };
  }

  try {
    const content = fs.readFileSync(cyclesPath, "utf-8");
    const data = JSON.parse(content) as {
      globalCycles?: Array<Record<string, unknown>>;
      academicCycles?: Array<Record<string, unknown>>;
      programCycles?: Array<Record<string, unknown>>;
    };
    return {
      globalCycles: data.globalCycles || [],
      academicCycles: data.academicCycles || [],
      programCycles: data.programCycles || [],
    };
  } catch (error) {
    console.error(`Error loading cycles.json:`, error);
    return {
      globalCycles: [],
      academicCycles: [],
      programCycles: [],
    };
  }
}

/**
 * Save cycles.json file
 */
function saveCyclesFile(
  orgDir: string,
  cycles: {
    globalCycles: Array<Record<string, unknown>>;
    academicCycles: Array<Record<string, unknown>>;
    programCycles: Array<Record<string, unknown>>;
  },
): void {
  const cyclesPath = path.join(orgDir, "cycles.json");
  const content = JSON.stringify(cycles, null, 2) + "\n";
  fs.writeFileSync(cyclesPath, content, "utf-8");
}

/**
 * Find or create academic cycle for a program
 */
function findOrCreateAcademicCycle(
  orgDir: string,
  programSlug: string,
  startDate: string,
  programName: string,
): string {
  const cycles = loadCyclesFile(orgDir);
  const cycleId = generateCycleId(programSlug, startDate);

  // Check if academic cycle already exists
  const existingCycle = cycles.academicCycles.find(
    (ac) => (ac.id as string) === cycleId,
  );
  if (existingCycle) {
    return cycleId;
  }

  // Create new academic cycle
  const endDate = calculateEndDate(startDate);
  const academicCycle = {
    id: cycleId,
    customLabel: `${programName} - ${new Date(startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
    startDate,
    endDate,
  };

  cycles.academicCycles.push(academicCycle);
  saveCyclesFile(orgDir, cycles);

  return cycleId;
}

/**
 * Find or create program cycle
 * Always creates both academic cycle and program cycle when schedule is available
 * Program cycle will have empty pricing if none is provided
 */
function findOrCreateProgramCycle(
  orgDir: string,
  programSlug: string,
  programName: string,
  startDate: string,
  pricing: ProgramEvidence["pricing"],
  extractionFilename: string,
): string | null {
  // Always create academic cycle if we have a start date
  const academicCycleId = findOrCreateAcademicCycle(
    orgDir,
    programSlug,
    startDate,
    programName,
  );

  // Always create program cycle when academic cycle is created
  // Use empty pricing if none is provided
  const cycles = loadCyclesFile(orgDir);
  const cycleId = generateCycleId(programSlug, startDate);

  // Check if program cycle already exists
  const existingCycle = cycles.programCycles.find(
    (pc) => (pc.id as string) === cycleId,
  );
  if (existingCycle) {
    return cycleId;
  }

  // Transform pricing to package (handles null/undefined by returning empty pricing)
  const pricingPackage = transformPricingToPackage(pricing);

  // Create new program cycle
  const programCycle = {
    id: cycleId,
    academicCycleId,
    pricingPackage,
    status: "open" as const,
    enrolled: 0,
    _source: extractionFilename,
    _addedAt: new Date().toISOString(),
  };

  cycles.programCycles.push(programCycle);
  saveCyclesFile(orgDir, cycles);

  return cycleId;
}

/**
 * Save organization changes
 */
export async function saveOrgChanges(
  orgId: string,
  orgData: Record<string, unknown>,
  extractionFilename: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const orgDir = findOrganizationDirectory(orgId);
    if (!orgDir) {
      return {
        success: false,
        error: `Organization directory not found for ${orgId}`,
      };
    }

    const orgJsonPath = path.join(orgDir, "org.json");

    // Load existing org to track changes
    let existingOrg: Record<string, unknown> = {};
    if (fs.existsSync(orgJsonPath)) {
      try {
        const content = fs.readFileSync(orgJsonPath, "utf-8");
        existingOrg = JSON.parse(content) as Record<string, unknown>;
      } catch (error) {
        // If we can't read existing, treat as new
      }
    }

    // Merge with existing data (idempotent - preserves existing fields not in orgData)
    const mergedOrg =
      Object.keys(existingOrg).length === 0
        ? { ...orgData }
        : { ...existingOrg, ...orgData };

    // Track changes
    const updatedFields = getChangedFields(existingOrg, mergedOrg);
    const isNew = Object.keys(existingOrg).length === 0;

    const changes: ChangeMetadata = {
      source: extractionFilename,
      timestamp: new Date().toISOString(),
      updatedFields,
      isNew,
    };

    // Apply change tracking metadata
    const orgWithMetadata = { ...mergedOrg };

    if (changes.isNew) {
      (orgWithMetadata as { _addedAt?: string })._addedAt = changes.timestamp;
      (orgWithMetadata as { _source?: string })._source = changes.source;
    } else {
      (orgWithMetadata as { _updatedAt?: string })._updatedAt =
        changes.timestamp;
      (orgWithMetadata as { _updatedFields?: string[] })._updatedFields =
        changes.updatedFields;
      (orgWithMetadata as { _source?: string })._source = changes.source;
      // Preserve _addedAt if it exists
      if ((existingOrg as { _addedAt?: string })._addedAt) {
        (orgWithMetadata as { _addedAt?: string })._addedAt = (
          existingOrg as { _addedAt?: string }
        )._addedAt;
      }
    }

    // Write to file
    const content = JSON.stringify(orgWithMetadata, null, 2) + "\n";
    fs.writeFileSync(orgJsonPath, content, "utf-8");

    revalidatePath("/admin/imports");
    return { success: true };
  } catch (error) {
    console.error("Error saving org changes:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Save program changes
 */
export async function saveProgramChanges(
  orgDir: string,
  programId: string,
  programData: Record<string, unknown>,
  extractionFilename: string,
  schedule?: { dates?: string[] } | null,
  pricing?: ProgramEvidence["pricing"],
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = findProgramFile(orgDir, programId);
    if (!result) {
      return {
        success: false,
        error: `Program ${programId} not found in any academic file`,
      };
    }

    // Load existing program to track changes
    const existingProgram =
      result.programs.find((p) => (p.id as string) === programId) ||
      ({} as Record<string, unknown>);

    // Merge with existing data (idempotent - preserves existing fields not in programData)
    const mergedProgram =
      Object.keys(existingProgram).length === 0
        ? { ...programData }
        : { ...existingProgram, ...programData };

    // Track changes
    const updatedFields = getChangedFields(
      existingProgram as Record<string, unknown>,
      mergedProgram,
    );
    const isNew = Object.keys(existingProgram).length === 0;

    const changes: ChangeMetadata = {
      source: extractionFilename,
      timestamp: new Date().toISOString(),
      updatedFields,
      isNew,
    };

    // Apply change tracking metadata
    const programWithMetadata = { ...mergedProgram };

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
      // Preserve _addedAt if it exists
      if ((existingProgram as { _addedAt?: string })._addedAt) {
        (programWithMetadata as { _addedAt?: string })._addedAt = (
          existingProgram as { _addedAt?: string }
        )._addedAt;
      }
    }

    // Update program in programs array
    const updatedPrograms = result.programs.map((p) => {
      if ((p.id as string) === programId) {
        return programWithMetadata;
      }
      return p;
    });

    // Create cycle if schedule is available (pricing is optional)
    let cycleId: string | null = null;
    if (schedule) {
      const startDate = extractStartDate(schedule);
      if (startDate) {
        const programSlug =
          (programWithMetadata.slug as string) ||
          (programWithMetadata.name as string)
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-") ||
          programId;
        const programName = (programWithMetadata.name as string) || programId;
        cycleId = findOrCreateProgramCycle(
          orgDir,
          programSlug,
          programName,
          startDate,
          pricing,
          extractionFilename,
        );
      }
    }

    // Add cycle ID to program's cycleIds array if cycle was created
    if (cycleId) {
      const programToUpdate = updatedPrograms.find(
        (p) => (p.id as string) === programId,
      );
      if (programToUpdate) {
        const existingCycleIds = (programToUpdate.cycleIds as string[]) || [];
        if (!existingCycleIds.includes(cycleId)) {
          programToUpdate.cycleIds = [...existingCycleIds, cycleId];
        }
      }
    }

    // Write back to file
    const updatedData = {
      programs: updatedPrograms,
    };

    const content = JSON.stringify(updatedData, null, 2) + "\n";
    fs.writeFileSync(result.filePath, content, "utf-8");

    revalidatePath("/admin/imports");
    return { success: true };
  } catch (error) {
    console.error("Error saving program changes:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create new organization (idempotent - will update if already exists)
 */
export async function createNewOrg(
  orgData: Record<string, unknown>,
  category: string,
  country: string,
  region: string | undefined,
  extractionFilename: string,
): Promise<{ success: boolean; orgDir?: string; error?: string }> {
  try {
    // Build directory path
    const pathParts = [category, country];
    if (region) {
      pathParts.push(region);
    }

    const username = orgData.username as string;
    if (!username) {
      return { success: false, error: "Username is required for new org" };
    }

    pathParts.push(username);
    const orgDir = path.join(ORGS_DIR, ...pathParts);

    // Create directory if it doesn't exist
    if (!fs.existsSync(orgDir)) {
      fs.mkdirSync(orgDir, { recursive: true });
    }

    const orgJsonPath = path.join(orgDir, "org.json");

    // Check if org already exists (idempotent)
    let existingOrg: Record<string, unknown> = {};
    let isNew = true;
    if (fs.existsSync(orgJsonPath)) {
      try {
        const content = fs.readFileSync(orgJsonPath, "utf-8");
        existingOrg = JSON.parse(content) as Record<string, unknown>;
        isNew = false;
      } catch (error) {
        // If we can't read existing, treat as new
      }
    }

    // Merge with existing data (idempotent - preserves existing fields not in orgData)
    const mergedOrg = isNew ? { ...orgData } : { ...existingOrg, ...orgData };

    // Apply metadata
    const orgWithMetadata = { ...mergedOrg };
    if (isNew) {
      (orgWithMetadata as { _addedAt?: string })._addedAt =
        new Date().toISOString();
      (orgWithMetadata as { _source?: string })._source = extractionFilename;
    } else {
      // Update metadata for existing org
      (orgWithMetadata as { _updatedAt?: string })._updatedAt =
        new Date().toISOString();
      (orgWithMetadata as { _source?: string })._source = extractionFilename;
      // Preserve _addedAt if it exists
      if ((existingOrg as { _addedAt?: string })._addedAt) {
        (orgWithMetadata as { _addedAt?: string })._addedAt = (
          existingOrg as { _addedAt?: string }
        )._addedAt;
      }
    }

    const content = JSON.stringify(orgWithMetadata, null, 2) + "\n";
    fs.writeFileSync(orgJsonPath, content, "utf-8");

    revalidatePath("/admin/imports");
    return { success: true, orgDir };
  } catch (error) {
    console.error("Error creating new org:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Mark an extraction as applied (updated)
 */
export async function markExtractionApplied(
  extractionId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const EXTRACTIONS_DIR = path.join(ROOT_DIR, "data/leads/extractions");
    const filePath = path.join(
      EXTRACTIONS_DIR,
      `${extractionId}-extraction.json`,
    );

    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: `Extraction file not found: ${extractionId}`,
      };
    }

    // Load existing extraction
    const content = fs.readFileSync(filePath, "utf-8");
    const extraction = JSON.parse(content) as Record<string, unknown>;

    // Add applied metadata
    const updatedExtraction = {
      ...extraction,
      _appliedAt: new Date().toISOString(),
    };

    // Write back to file
    const updatedContent = JSON.stringify(updatedExtraction, null, 2) + "\n";
    fs.writeFileSync(filePath, updatedContent, "utf-8");

    revalidatePath("/admin/imports");
    return { success: true };
  } catch (error) {
    console.error("Error marking extraction as applied:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create new program (idempotent - will update if already exists)
 */
export async function createNewProgram(
  orgDir: string,
  programData: Record<string, unknown>,
  extractionFilename: string,
  schedule?: { dates?: string[] } | null,
  pricing?: ProgramEvidence["pricing"],
): Promise<{ success: boolean; error?: string }> {
  try {
    const programId = programData.id as string;
    if (!programId) {
      return { success: false, error: "Program ID is required" };
    }

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

    // Check if program already exists (idempotent)
    const existingProgramIndex = programs.findIndex(
      (p) => (p.id as string) === programId,
    );
    const isNew = existingProgramIndex === -1;

    // Merge with existing data if updating (idempotent)
    const existingProgram = isNew
      ? ({} as Record<string, unknown>)
      : (programs[existingProgramIndex] as Record<string, unknown>);
    const mergedProgram = isNew
      ? { ...programData }
      : { ...existingProgram, ...programData };

    // Apply metadata
    const programWithMetadata = { ...mergedProgram };
    if (isNew) {
      (programWithMetadata as { _addedAt?: string })._addedAt =
        new Date().toISOString();
      (programWithMetadata as { _source?: string })._source =
        extractionFilename;
      programs.push(programWithMetadata);
    } else {
      // Update metadata for existing program
      (programWithMetadata as { _updatedAt?: string })._updatedAt =
        new Date().toISOString();
      (programWithMetadata as { _source?: string })._source =
        extractionFilename;
      // Preserve _addedAt if it exists
      if ((existingProgram as { _addedAt?: string })._addedAt) {
        (programWithMetadata as { _addedAt?: string })._addedAt = (
          existingProgram as { _addedAt?: string }
        )._addedAt;
      }
      programs[existingProgramIndex] = programWithMetadata;
    }

    // Create cycle if schedule is available (pricing is optional)
    let cycleId: string | null = null;
    if (schedule) {
      const startDate = extractStartDate(schedule);
      if (startDate) {
        const programSlug =
          (programData.slug as string) ||
          (programData.name as string)
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-") ||
          programId;
        const programName = (programData.name as string) || programId;
        cycleId = findOrCreateProgramCycle(
          orgDir,
          programSlug,
          programName,
          startDate,
          pricing,
          extractionFilename,
        );
      }
    }

    // Add cycle ID to program's cycleIds array if cycle was created
    if (cycleId) {
      // For new programs, programWithMetadata is already in the array
      // For existing programs, programs[existingProgramIndex] points to programWithMetadata
      const programToUpdate = isNew
        ? programWithMetadata
        : programs[existingProgramIndex];
      if (programToUpdate) {
        const existingCycleIds = (programToUpdate.cycleIds as string[]) || [];
        if (!existingCycleIds.includes(cycleId)) {
          programToUpdate.cycleIds = [...existingCycleIds, cycleId];
        }
      }
    }

    // Write back to file
    const updatedData = {
      programs,
    };

    const content = JSON.stringify(updatedData, null, 2) + "\n";
    fs.writeFileSync(academicPath, content, "utf-8");

    revalidatePath("/admin/imports");
    return { success: true };
  } catch (error) {
    console.error("Error creating new program:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
