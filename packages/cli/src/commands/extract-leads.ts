import { Command } from "commander";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { validateExtraction } from "../validation/validate-extraction.js";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../../../");

// Constants
const INPUT_IMAGES_DIR = path.join(ROOT_DIR, "data/leads/inputs/images");
const EXTRACTIONS_DIR = path.join(ROOT_DIR, "data/leads/extractions");
const REGISTRY_FILE = path.join(ROOT_DIR, "data/leads/inputs/registry.json");

// System prompt for entity extraction
const SYSTEM_PROMPT = `
You are an automated **program evidence extraction system**.

You analyze one or more input images (ads, posts, screenshots).
All images represent **educational programs**.

Your task is to extract **structured, machine-readable evidence only**.
Do not infer, explain, or normalize. The JSON structure carries meaning.

The system has two phases:
- Phase 1: Evidence Extraction
- Phase 2: Entity Candidate Construction

────────────────────────────────
GLOBAL RULES
────────────────────────────────

- Extract ONLY what is explicitly visible
- Treat the image as a forensic artifact
- Do not guess or fill gaps
- Do not merge or deduplicate
- Output valid JSON ONLY

If something is unclear, include it as-is or omit it.

────────────────────────────────
PHASE 1 — EVIDENCE EXTRACTION
────────────────────────────────

Extract the following if visible.

### Organization Names
Organization or business names exactly as written. Extract all variations if multiple appear.

### Programs
Each program MUST be its own object.
Programs may have different pricing, schedules, etc.

For EACH program, extract independently:
- name (program title/name)
- quickFacts (marketing phrases, outcomes, descriptors)
- pricing (CRITICAL: separate registration, tuition, and materials - see pricing structure below)
- schedule (days, times, dates, duration)
- location (if program-specific, raw address string)
- callsToAction (call-to-action phrases)

If pricing or schedule is shared across programs, repeat it per program.

#### Pricing Structure (IMPORTANT)
Extract pricing with clear separation:
- registration: One-time upfront fees (registration fees, deposits, enrollment fees)
  - For each: amount (raw string), currency hint if visible, label, notes
- tuition: Ongoing fees (course fees, program fees, tuition)
  - For each: amount (raw string), currency hint if visible, label, billingCycle if mentioned, notes
- materials: Optional fees (materials, kits, supplies)
  - For each: amount (raw string), currency hint if visible, label, notes
- paymentPlans: Any mentions of payment plans, installments, etc.
- other: Any other pricing-related text not clearly categorized

### Shared / Global Data
Extract separately if not program-specific:
- contacts: phones (with type hint if WhatsApp mentioned), emails
- socialLinks: social media handles/URLs (platform, handle, url, value)
- urls: Other URLs found
- locations: Org-level location strings
- platformSignals: Platform UI elements (Sponsored, See more, etc.)

Do NOT attach global data to programs unless explicitly tied visually.

────────────────────────────────
PHASE 2 — ENTITY CANDIDATES
────────────────────────────────

Create entity candidates from extracted evidence.

Allowed candidate types:
- organization
- program
- phone
- email
- social_link
- website

Rules:
- Every extracted program MUST produce a program candidate
- Every organization name MUST produce an organization candidate
- Candidates reference extracted objects by id
- No merging or interpretation

Each candidate includes:
- id
- type
- ref (extraction id)
- value (optional, extracted value for direct matching)

────────────────────────────────
OUTPUT FORMAT (STRICT)
────────────────────────────────

Return ONE JSON object with this shape:

{
  "artifact": {
    "id": "string",
    "source": {
      "ingest_method": "manual_upload" | "file_read" | "api_ingest",
      "platform_hint": "string | null",
      "captured_at": "ISO-8601 | null",
      "locale_hint": "string | null"
    },
    "file": {
      "filename": "string | null",
      "hash": "string | null"
    }
  },
  "extraction": {
    "organizationNames": [
      {
        "id": "string",
        "name": "string",
        "confidence": "high" | "medium" | "low" (optional)
      }
    ],
    "programs": [
      {
        "id": "string",
        "name": "string",
        "quickFacts": ["string"] (optional),
        "pricing": {
          "registration": [
            {
              "amount": "string",
              "currency": "string" (optional),
              "label": "string" (optional),
              "notes": "string" (optional)
            }
          ] (optional),
          "tuition": [
            {
              "amount": "string",
              "currency": "string" (optional),
              "label": "string" (optional),
              "billingCycle": "string" (optional),
              "notes": "string" (optional)
            }
          ] (optional),
          "materials": [
            {
              "amount": "string",
              "currency": "string" (optional),
              "label": "string" (optional),
              "notes": "string" (optional)
            }
          ] (optional),
          "paymentPlans": ["string"] (optional),
          "other": ["string"] (optional)
        } (optional),
        "schedule": {
          "days": ["string"] (optional),
          "times": ["string"] (optional),
          "dates": ["string"] (optional),
          "duration": "string" (optional)
        } (optional),
        "location": "string | null" (optional),
        "callsToAction": ["string"] (optional)
      }
    ],
    "contacts": {
      "phones": [
        {
          "value": "string",
          "type": "phone" | "whatsapp" (optional)
        }
      ],
      "emails": [
        {
          "value": "string"
        }
      ]
    },
    "socialLinks": [
      {
        "platform": "facebook" | "instagram" | "youtube" | "x" | "website" | "other",
        "handle": "string" (optional),
        "url": "string" (optional),
        "value": "string"
      }
    ],
    "urls": ["string"] (optional),
    "locations": ["string"] (optional),
    "platformSignals": ["string"] (optional)
  },
  "entityCandidates": [
    {
      "id": "string",
      "type": "organization" | "program" | "phone" | "email" | "social_link" | "website",
      "ref": "string",
      "value": "string" (optional)
    }
  ]
}

────────────────────────────────
FINAL INSTRUCTION
────────────────────────────────

Assume all images represent PROGRAMS.
Process ONLY the provided image(s).
Output JSON only.
CRITICAL: Separate registration fees from tuition fees in pricing structure.

`;

/**
 * Read registry file
 */
function readRegistry() {
  try {
    if (fs.existsSync(REGISTRY_FILE)) {
      const content = fs.readFileSync(REGISTRY_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    console.warn("Warning: Could not read registry file, starting fresh");
  }
  return {};
}

/**
 * Write registry file
 */
function writeRegistry(registry: Record<string, string>) {
  try {
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2) + "\n");
  } catch (error) {
    console.error("Error writing registry file:", (error as Error).message);
    throw error;
  }
}

/**
 * Extract entities using Gemini CLI
 */
async function extractWithGemini(imagePath: string) {
  const tmpDir = path.join(ROOT_DIR, "tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const imageFilename = path.basename(imagePath);
  const tmpImagePath = path.join(tmpDir, imageFilename);

  // Copy the image to tmp
  fs.copyFileSync(imagePath, tmpImagePath);

  let stdout: string;
  let stderr: string;

  try {
    const absoluteImagePath = path.resolve(tmpImagePath);
    const prompt = `${SYSTEM_PROMPT}

Read and analyze the image file at: ${absoluteImagePath}

CRITICAL: You MUST respond with ONLY valid JSON matching the structure specified above. Do not include any prose, explanations, or markdown code blocks. Return ONLY the JSON object.`;

    const promptFile = path.join(tmpDir, `prompt-${Date.now()}.txt`);
    fs.writeFileSync(promptFile, prompt, "utf-8");

    try {
      const command = `gemini --output-format json < "${promptFile}"`;
      const result = await execAsync(command, {
        env: process.env,
        maxBuffer: 10 * 1024 * 1024,
        encoding: "utf-8",
      } as { env?: NodeJS.ProcessEnv; maxBuffer?: number; encoding: string });

      stdout = result.stdout as string;
      stderr = result.stderr as string;
    } finally {
      try {
        if (fs.existsSync(promptFile)) {
          fs.unlinkSync(promptFile);
        }
      } catch {
        // Ignore cleanup errors
      }
    }

    if (stderr && !stderr.includes("Warning")) {
      console.warn("Gemini CLI stderr:", stderr);
    }

    const parsed = JSON.parse(stdout.trim());

    if (!parsed.response) {
      throw new Error("No response field in gemini-cli output");
    }

    const responseText = parsed.response.trim();
    const jsonBlockMatch = responseText.match(
      /```(?:json)?\s*\n(\{[\s\S]*\})\n```/,
    );
    if (jsonBlockMatch) {
      try {
        return JSON.parse(jsonBlockMatch[1]);
      } catch (parseError) {
        throw new Error(
          `Failed to parse JSON from code block: ${(parseError as Error).message}. Response starts with: ${responseText.substring(0, 200)}`,
        );
      }
    }

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(
        `Could not find JSON in response. Response starts with: ${responseText.substring(0, 300)}`,
      );
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(
        "Gemini CLI not found. Install it with: npm install -g @google/gemini-cli",
      );
    }
    throw error;
  } finally {
    try {
      if (fs.existsSync(tmpImagePath)) {
        fs.unlinkSync(tmpImagePath);
      }
    } catch (cleanupError) {
      console.warn(
        "Warning: Could not clean up tmp image file:",
        (cleanupError as Error).message,
      );
    }
  }
}

/**
 * Process a single image
 */
async function processImage(imagePath: string) {
  const imageFilename = path.basename(imagePath);

  console.log(`🔍 Processing ${imageFilename}...`);

  try {
    const extracted = await extractWithGemini(imagePath);

    // Validate structure using JSON Schema
    const validation = validateExtraction(extracted);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.error}`);
    }

    const baseName = path.basename(imageFilename, path.extname(imageFilename));
    const outputFilename = `${baseName}-extraction.json`;
    const outputPath = path.join(EXTRACTIONS_DIR, outputFilename);

    fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2) + "\n");
    console.log(`✅ Saved extraction to ${outputFilename}`);

    const currentRegistry = readRegistry();
    currentRegistry[imageFilename] = outputFilename;
    writeRegistry(currentRegistry);

    console.log(`✨ Successfully processed ${imageFilename}`);
    return { success: true, imageFilename, outputFilename };
  } catch (error) {
    console.error(
      `❌ Error processing ${imageFilename}:`,
      (error as Error).message,
    );
    return { success: false, imageFilename, error: (error as Error).message };
  }
}

/**
 * Get all image files from inputs directory
 */
function getImageFiles(): string[] {
  if (!fs.existsSync(INPUT_IMAGES_DIR)) {
    return [];
  }

  const files = fs.readdirSync(INPUT_IMAGES_DIR);
  return files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext);
    })
    .map((file) => path.join(INPUT_IMAGES_DIR, file));
}

export const extractLeadsCommand = new Command("extract-leads")
  .description("Extract lead entities from ad images")
  .argument(
    "[images...]",
    "Image file paths to process (default: all unprocessed images)",
  )
  .action(async (imagePaths: string[]) => {
    // Ensure directories exist
    if (!fs.existsSync(EXTRACTIONS_DIR)) {
      fs.mkdirSync(EXTRACTIONS_DIR, { recursive: true });
    }

    let paths: string[] = [];

    if (imagePaths.length > 0) {
      paths = imagePaths.map((arg) => {
        if (path.isAbsolute(arg)) {
          return arg;
        }
        return path.resolve(process.cwd(), arg);
      });
    } else {
      paths = getImageFiles();
      if (paths.length === 0) {
        console.log("No images found in inputs directory");
        process.exit(0);
      }
    }

    const registry = readRegistry();
    const unprocessedImages = paths.filter((imagePath) => {
      const imageFilename = path.basename(imagePath);
      if (registry[imageFilename]) {
        console.log(`⏭️  Skipping ${imageFilename} (already processed)`);
        return false;
      }
      return true;
    });

    if (unprocessedImages.length === 0) {
      console.log("✅ All images have been processed!");
      process.exit(0);
    }

    console.log(`📸 Found ${unprocessedImages.length} image(s) to process\n`);

    const results = await Promise.allSettled(
      unprocessedImages.map((imagePath) => {
        if (!fs.existsSync(imagePath)) {
          console.error(`❌ Image not found: ${imagePath}`);
          return Promise.resolve({
            success: false,
            imageFilename: path.basename(imagePath),
            error: "File not found",
          });
        }
        return processImage(imagePath);
      }),
    );

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value?.success,
    ).length;
    const failed = results.filter(
      (r) =>
        r.status === "rejected" ||
        (r.status === "fulfilled" && !r.value?.success),
    ).length;

    console.log("\n🎉 Processing complete!");
    console.log(`✅ Successful: ${successful}`);
    if (failed > 0) {
      console.log(`❌ Failed: ${failed}`);
      process.exit(1);
    }
  });
