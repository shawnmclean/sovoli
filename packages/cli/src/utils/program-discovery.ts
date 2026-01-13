import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../../../");

/**
 * Program information from organization's academic files
 */
export interface ProgramInfo {
  id: string;
  name: string;
  cycleIds?: string[];
}

/**
 * Program cycle information from organization's cycles.json
 */
export interface ProgramCycleInfo {
  id: string;
  academicCycleId: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Load programs from an organization directory
 * Looks for *-academic.json files or academic.json
 */
export function loadOrganizationPrograms(orgDir: string): ProgramInfo[] {
  const programsMap = new Map<string, ProgramInfo>();

  try {
    // Try group-based format first (e.g., massage-therapy-academic.json)
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
            slug?: string;
          }>;
        };

        if (data.programs) {
          for (const program of data.programs) {
            if (program.id && program.name) {
              // Deduplicate by program ID (in case same program appears in multiple files)
              if (!programsMap.has(program.id)) {
                programsMap.set(program.id, {
                  id: program.id,
                  name: program.name,
                  cycleIds: (program as { cycleIds?: string[] }).cycleIds,
                });
              }
            }
          }
        }
      } catch (error) {
        console.warn(`Error loading programs from ${academicFile}:`, error);
      }
    }
  } catch (error) {
    console.warn(`Error loading programs from ${orgDir}:`, error);
  }

  return Array.from(programsMap.values());
}

/**
 * Load program cycles from an organization's cycles.json
 */
export function loadOrganizationCycles(orgDir: string): ProgramCycleInfo[] {
  const cyclesPath = path.join(orgDir, "cycles.json");

  if (!fs.existsSync(cyclesPath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(cyclesPath, "utf-8");
    const data = JSON.parse(content) as {
      programCycles?: Array<{
        id: string;
        academicCycleId: string;
      }>;
      academicCycles?: Array<{
        id: string;
        startDate?: string;
        endDate?: string;
      }>;
    };

    const cycles: ProgramCycleInfo[] = [];

    // Create a map of academic cycles for date lookup
    const academicCyclesMap = new Map<
      string,
      { startDate?: string; endDate?: string }
    >();
    if (data.academicCycles) {
      for (const ac of data.academicCycles) {
        academicCyclesMap.set(ac.id, {
          startDate: ac.startDate,
          endDate: ac.endDate,
        });
      }
    }

    // Process program cycles
    if (data.programCycles) {
      for (const pc of data.programCycles) {
        const academicCycle = academicCyclesMap.get(pc.academicCycleId);

        cycles.push({
          id: pc.id,
          academicCycleId: pc.academicCycleId,
          startDate: academicCycle?.startDate,
          endDate: academicCycle?.endDate,
        });
      }
    }

    return cycles;
  } catch (error) {
    console.warn(`Error loading cycles from ${cyclesPath}:`, error);
    return [];
  }
}

/**
 * Find organization directory from org ID
 */
export function findOrganizationDirectory(orgId: string): string | null {
  const orgsDir = path.join(
    ROOT_DIR,
    "apps/sovoli.com/src/modules/data/organisations",
  );

  if (!fs.existsSync(orgsDir)) {
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

  return searchDirectory(orgsDir);
}
