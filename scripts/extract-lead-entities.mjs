/**
 * Extract Lead Entities from Ad Images
 *
 * This script processes screenshot images of educational/training program ads
 * and extracts entity evidence using Gemini CLI.
 *
 * Usage:
 *   node scripts/extract-lead-entities.mjs [image-path...]
 *
 * Examples:
 *   # Process all unprocessed images in inputs/images directory (default)
 *   node scripts/extract-lead-entities.mjs
 *
 *   # Process specific image(s)
 *   node scripts/extract-lead-entities.mjs "data/leads/inputs/images/IMG_6245.PNG"
 *
 * The script will:
 * - Check the registry to skip already-processed images
 * - Process remaining images in parallel
 * - Save extracted JSON files to data/leads/extractions/
 * - Update the registry to track processed images
 *
 * Prerequisites:
 *   - Gemini CLI must be installed (npm install -g @google/gemini-cli)
 *   - Authentication: Gemini CLI uses cached credentials or GEMINI_API_KEY
 */

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const INPUT_IMAGES_DIR = path.join(__dirname, "../data/leads/inputs/images");
const EXTRACTIONS_DIR = path.join(__dirname, "../data/leads/extractions");
const REGISTRY_FILE = path.join(__dirname, "../data/leads/registry.json");

// System prompt for entity extraction
const SYSTEM_PROMPT = `You are an automated entity evidence extraction system.

Your role is to analyze one or more input images (advertisements, social posts, screenshots)
that are **known in advance to represent educational or training programs**.

You MUST assume:
- All promoted activities are programs
- You are not responsible for determining business type or intent

This system operates in two strict phases only:
- Phase 1: Evidence Extraction
- Phase 2: Entity Candidate Construction

You MUST follow the rules below exactly.

────────────────────────────────
GLOBAL RULES (MANDATORY)
────────────────────────────────

1. You must:
- Treat the image as a forensic artifact
- Extract only what is explicitly and visibly present
- Extract claims, not conclusions
- Preserve ambiguity in unclear details (dates, prices, wording)
- Assign confidence values conservatively
- Output valid JSON ONLY (no prose, no markdown)

2. If something is unclear, partially visible, stylized, or ambiguous:
- Include it with LOWER confidence
- Do NOT exclude it silently

3. All confidence scores MUST be between 0.0 and 1.0

────────────────────────────────
PHASE 1 — EVIDENCE EXTRACTION
────────────────────────────────

Extract ONLY what is explicitly and visibly present in the image(s).

All activities shown MUST be treated as PROGRAMS.

Extract the following categories if they are visible:

- Brand or organization strings (exact text as shown)
- Program titles (courses, workshops, training programs, certifications)
- Program descriptors (features, outcomes, accreditation claims, marketing phrases)
- Program pricing (amounts, currency if visible, deposits, specials)
- Program schedules (start dates, end dates, days, times, duration)
- Locations (addresses, cities)
- Contact information (phone, email)
- Social handles (Instagram, Facebook, WhatsApp, etc.)
- URLs or domains (including partial or subdomains)
- Calls to action (Apply, Enroll, Register, WhatsApp, Learn More)
- Platform signals (e.g. "Sponsored", Facebook UI elements)

Each extracted item MUST include:
- exact visible value
- a confidence score

────────────────────────────────
PHASE 2 — ENTITY CANDIDATE CONSTRUCTION
────────────────────────────────

From the extracted evidence, create ENTITY CANDIDATES.

Entity candidates are possible identifiers, not confirmed real-world entities.

Allowed candidate types:
- brand
- phone
- email
- instagram_handle
- facebook_page
- website
- whatsapp_identity
- educational_program

ALL extracted programs MUST produce educational_program candidates.

For each candidate, include:
- candidate_id (stable, human-readable)
- type
- value (exact extracted value)
- basis (which extracted evidence supports it)
- derived_from (JSON paths of contributing claims)
- confidence (derived from contributing claims)

────────────────────────────────
OUTPUT FORMAT (MANDATORY)
────────────────────────────────

Return a SINGLE JSON OBJECT with EXACTLY this structure:

{
"artifact": {
"id": "string",
"type": "image",
"source": {
"ingest_method": "string",
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
"brand_strings": [],
"programs": [],
"descriptors": [],
"pricing": [],
"schedule": {},
"locations": [],
"contacts": {
"phones": [],
"emails": [],
"handles": [],
"urls": []
},
"calls_to_action": [],
"platform_signals": []
},
"entity_candidates": [],
"confidence_summary": {
"overall_artifact_confidence": 0.0,
"notes": "string"
}
}

────────────────────────────────
CONFIDENCE GUIDELINES
────────────────────────────────

Assign confidence based ONLY on visual clarity and prominence.

Use these base heuristics:

- Large headline or logo text: ~0.9–0.95
- Explicit phone or email: ~0.95
- URLs clearly visible: ~0.95
- Body text, smaller fonts: ~0.7–0.85
- Partially obscured or stylized: ~0.5–0.7
- Ambiguous or unclear: ~0.3–0.5`;

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
function writeRegistry(registry) {
  try {
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2) + "\n");
  } catch (error) {
    console.error("Error writing registry file:", error.message);
    throw error;
  }
}

/**
 * Extract entities using Gemini CLI
 */
async function extractWithGemini(imagePath) {
  // Copy image to tmp directory (not gitignored) so gemini-cli can read it
  const tmpDir = path.join(__dirname, "../tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const imageFilename = path.basename(imagePath);
  const tmpImagePath = path.join(tmpDir, imageFilename);

  // Copy the image to tmp
  fs.copyFileSync(imagePath, tmpImagePath);

  let stdout;
  let stderr;

  try {
    // Use absolute path for image in tmp
    const absoluteImagePath = path.resolve(tmpImagePath);

    // Build the prompt - reference the file path and ask for JSON
    const prompt = `${SYSTEM_PROMPT}

Read and analyze the image file at: ${absoluteImagePath}

CRITICAL: You MUST respond with ONLY valid JSON matching the structure specified above. Do not include any prose, explanations, or markdown code blocks. Return ONLY the JSON object.`;

    // Build gemini-cli command - use a temp file for the prompt to avoid Windows command line length limits
    const promptFile = path.join(tmpDir, `prompt-${Date.now()}.txt`);
    fs.writeFileSync(promptFile, prompt, "utf-8");

    try {
      // Use input redirection to pass the prompt file
      const command = `gemini --output-format json < "${promptFile}"`;

      const result = await execAsync(command, {
        env: process.env,
        shell: true,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large responses
      });

      stdout = result.stdout;
      stderr = result.stderr;
    } finally {
      // Clean up prompt file
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

    // Parse the JSON output - gemini-cli returns JSON with "response" field
    const parsed = JSON.parse(stdout.trim());

    if (!parsed.response) {
      throw new Error("No response field in gemini-cli output");
    }

    // gemini-cli returns JSON with a "response" field containing markdown code blocks with JSON
    // The response is typically: "```json\n{...}\n```"
    const responseText = parsed.response.trim();

    // Extract JSON from markdown code blocks (handles ```json\n...\n``` or ```\n...\n```)
    const jsonBlockMatch = responseText.match(
      /```(?:json)?\s*\n(\{[\s\S]*\})\n```/,
    );
    if (jsonBlockMatch) {
      try {
        return JSON.parse(jsonBlockMatch[1]);
      } catch (parseError) {
        throw new Error(
          `Failed to parse JSON from code block: ${parseError.message}. Response starts with: ${responseText.substring(0, 200)}`,
        );
      }
    }

    // If no code blocks, try parsing the whole response as JSON (fallback)
    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(
        `Could not find JSON in response. Response starts with: ${responseText.substring(0, 300)}`,
      );
    }
  } catch (error) {
    // Check if it's a command not found error
    if (error.code === "ENOENT") {
      throw new Error(
        "Gemini CLI not found. Install it with: npm install -g @google/gemini-cli",
      );
    }

    // If it's a JSON parse error, show the actual response
    if (error.message.includes("JSON") || error.message.includes("token")) {
      // Try to parse stdout to see what we got
      try {
        const result = JSON.parse(error.stdout || stdout);
        if (result.response) {
          console.error(
            "AI Response (first 500 chars):",
            result.response.substring(0, 500),
          );
        }
      } catch {
        // Not JSON, show raw output
        if (stdout) {
          console.error(
            "Raw stdout (first 500 chars):",
            stdout.substring(0, 500),
          );
        }
      }
    }

    console.error("Error with Gemini CLI:", error.message);
    if (error.stdout && !error.message.includes("JSON")) {
      console.error("STDOUT:", error.stdout.substring(0, 500));
    }
    if (error.stderr && !error.stderr.includes("Loaded cached credentials")) {
      console.error("STDERR:", error.stderr);
    }
    throw error;
  } finally {
    // Clean up tmp image file
    try {
      if (fs.existsSync(tmpImagePath)) {
        fs.unlinkSync(tmpImagePath);
      }
    } catch (cleanupError) {
      console.warn(
        "Warning: Could not clean up tmp image file:",
        cleanupError.message,
      );
    }
  }
}

/**
 * Validate extracted JSON structure
 */
function validateExtraction(extracted) {
  if (!extracted || typeof extracted !== "object") {
    return { valid: false, error: "Extracted data is not an object" };
  }

  const required = ["extraction", "entity_candidates"];
  for (const field of required) {
    if (!(field in extracted)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  if (!extracted.extraction || typeof extracted.extraction !== "object") {
    return { valid: false, error: "extraction must be an object" };
  }

  if (!Array.isArray(extracted.entity_candidates)) {
    return { valid: false, error: "entity_candidates must be an array" };
  }

  return { valid: true };
}

/**
 * Process a single image
 */
async function processImage(imagePath) {
  const imageFilename = path.basename(imagePath);

  console.log(`🔍 Processing ${imageFilename}...`);

  try {
    // Extract entities
    const extracted = await extractWithGemini(imagePath);

    // Validate structure
    const validation = validateExtraction(extracted);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.error}`);
    }

    // Generate output filename
    const baseName = path.basename(imageFilename, path.extname(imageFilename));
    const outputFilename = `${baseName}-extraction.json`;
    const outputPath = path.join(EXTRACTIONS_DIR, outputFilename);

    // Save extracted JSON
    fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2) + "\n");
    console.log(`✅ Saved extraction to ${outputFilename}`);

    // Update registry (each process reads/writes independently for thread-safety)
    const currentRegistry = readRegistry();
    currentRegistry[imageFilename] = outputFilename;
    writeRegistry(currentRegistry);

    console.log(`✨ Successfully processed ${imageFilename}`);
    return { success: true, imageFilename, outputFilename };
  } catch (error) {
    console.error(`❌ Error processing ${imageFilename}:`, error.message);
    return { success: false, imageFilename, error: error.message };
  }
}

/**
 * Get all image files from inputs directory
 */
function getImageFiles() {
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

/**
 * Main function
 */
async function main() {
  // Ensure directories exist
  if (!fs.existsSync(EXTRACTIONS_DIR)) {
    fs.mkdirSync(EXTRACTIONS_DIR, { recursive: true });
  }

  const args = process.argv.slice(2);
  let imagePaths = [];

  if (args.length > 0) {
    // Process specific files provided as arguments
    imagePaths = args.map((arg) => {
      if (path.isAbsolute(arg)) {
        return arg;
      }
      return path.resolve(process.cwd(), arg);
    });
  } else {
    // Process all images in inputs directory
    imagePaths = getImageFiles();
    if (imagePaths.length === 0) {
      console.log("No images found in inputs directory");
      process.exit(0);
    }
  }

  // Read registry to filter out already-processed images
  const registry = readRegistry();
  const unprocessedImages = imagePaths.filter((imagePath) => {
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

  // Process images in parallel
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

  // Summary
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
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
