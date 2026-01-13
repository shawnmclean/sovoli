"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { getChangedFields } from "./utils/change-tracking";
import type { ChangeMetadata } from "./utils/change-tracking";

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
 * Create new program (idempotent - will update if already exists)
 */
export async function createNewProgram(
  orgDir: string,
  programData: Record<string, unknown>,
  extractionFilename: string,
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
