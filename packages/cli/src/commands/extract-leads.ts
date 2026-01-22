import { google } from "@ai-sdk/google";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { leadExtractionDocumentSchema } from "../validation/schemas/lead-extraction-schema.js";
import { validateExtraction } from "../validation/validate-extraction.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../../../");

// Constants
const INPUT_IMAGES_DIR = path.join(ROOT_DIR, "data/leads/inputs/images");
const EXTRACTIONS_DIR = path.join(ROOT_DIR, "data/leads/extractions");

// System prompt for entity extraction
const SYSTEM_PROMPT = `
You are an automated **program evidence extraction system**.

You analyze one or more input images (ads, posts, screenshots).
All images represent **educational programs**.

Your task is to extract **structured, machine-readable evidence only**.
Do not infer, explain, or normalize. The JSON structure carries meaning.

The system has two phases:
- Phase 1: Evidence Extraction
- Phase 2: Business Identification

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
FORMATTING RULES
────────────────────────────────

Apply proper title case formatting to all extracted text values for presentable output.

- **Platform names**: Use lowercase ("instagram", "facebook", "whatsapp")
- **Program names, business names, locations, learning topics**: Use proper title case (capitalize first letter of each significant word)
- **Preserve intentional styling** only if clearly part of the brand (e.g., "3-IN-1")
- When in doubt, use standard title case conventions

────────────────────────────────
PHASE 1 — EVIDENCE EXTRACTION
────────────────────────────────

Extract the following if visible.

### Programs
Each program MUST be its own object.
Programs may have different pricing, schedules, etc.

For EACH program, extract independently:
- name (program title/name - use proper title case formatting as specified in FORMATTING RULES)
- quickFacts (marketing phrases, outcomes, descriptors, included items - see distinction below)
- whatYouWillLearn (actual learning content - techniques, skills, topics that will be taught - use proper capitalization as specified in FORMATTING RULES - see distinction below)
- pricing (CRITICAL: separate registration, tuition, and materials - see pricing structure below)
- schedule (days, times, dates, duration)
- location (if program-specific, raw address string - use proper title case formatting as specified in FORMATTING RULES)
- callsToAction (call-to-action phrases)

#### Content Separation (CRITICAL)

**quickFacts** should contain:
- Marketing phrases and outcomes (e.g., "Three For the Price of One", "Certification Included")
- Included items (e.g., "Deluxe Kit", "Manual", "Live Model", "3 Manuals", "3 Certification of completion")
- Business/marketing support (e.g., "Marketing & Business Tips", "Vendor list", "Lifetime Mentorship")
- General descriptors and value propositions

**whatYouWillLearn** should contain:
- Actual learning content - techniques, skills, topics that will be taught
- Examples: "Classic|Hybrid|Volume|Wipsy", "Fan Making", "Isolation", "Placement", "Lash techniques", "Waxing Techniques", "Types of Wax", "Brow Shaping & Tinting", "Brow Texture", "Brow anatomy"
- Technical terms and specific skills students will acquire
- Do NOT include marketing phrases, included items, or business support in whatYouWillLearn

If pricing or schedule is shared across programs, repeat it per program.

#### Multi-Program Detection (CRITICAL)

When extracting programs, look for bundled or multi-program offerings:

**Detection Indicators:**
- Program names containing: "3-IN-1", "Bundle", "Package", "Combo", "Group Class", numbers (e.g., "2-in-1", "3-for-1", "3-IN-1")
- Content listing multiple program names (e.g., "LASH", "WAXING", "BROW LAMINATION" appearing as separate items or headers)
- "What you will learn" sections that clearly reference different programs or techniques

**When Multiple Programs Detected:**
1. Split the bundled program into separate program objects
2. Extract individual program names from the content:
   - Look for capitalized program names, headers, or section titles in the image
   - Use the actual program names found and format them with proper title case (e.g., "Lash", "Waxing", "Brow Lamination") rather than the bundle name
   - Apply FORMATTING RULES for program names
3. For each program, match learning content ("what you will learn" items) based on:
   - **Keywords**: Items containing program-specific terms (e.g., "Lash", "Waxing", "Brow", "Lamination")
   - **Semantic relevance**: Technical terms associated with each program:
     - Lash: "Classic", "Hybrid", "Volume", "Wipsy", "Bottom lash", "Fan Making", "Isolation", "Placement", "Lash techniques"
     - Waxing: "Waxing Techniques", "Types of Wax", "Hair Grow", "Aftercare & Precare"
     - Brow: "Brow Shaping", "Brow Tinting", "Brow Texture", "Brow anatomy"
   - **Visual grouping**: If content appears under specific program headers or sections in the image
4. Each program object should have:
   - A distinct name (extract from content, don't use the bundle name like "3-IN-1 Group Class")
   - Only relevant learning items in whatYouWillLearn (match items to the correct program)
   - Shared marketing/included items in quickFacts (e.g., "Deluxe Kit", "Manual", "Certification of completion")
   - Shared pricing/schedule if applicable (repeat across programs when shared)
   - Program-specific location if different

**Example:**
If you see "3-IN-1 Group Class" with content mentioning "LASH", "WAXING", "BROW LAMINATION" and learning items like:
- Lash program:
  - whatYouWillLearn: ["Classic|Hybrid|Volume|Wipsy", "Bottom lash", "Fan Making", "Isolation", "Placement", "Lash techniques"]
  - quickFacts: ["Deluxe Kit", "Manual", "Live Model", "Marketing & Business Tips", "Certification of completion", "Vendor list", "Lifetime Mentorship"]
- Waxing program:
  - whatYouWillLearn: ["Waxing Techniques", "Types of Wax", "Aftercare & Precare", "Hair Grow"]
  - quickFacts: ["Deluxe Kit", "Manual", "Live Model", "Marketing & Business Tips", "Certification of completion", "Vendor list", "Lifetime Mentorship"]
- Brow Lamination program:
  - whatYouWillLearn: ["Brow Shaping & Tinting", "Brow Texture", "Brow anatomy", "Product & Tools"]
  - quickFacts: ["Deluxe Kit", "Manual", "Live Model", "Marketing & Business Tips", "Certification of completion", "Vendor list", "Lifetime Mentorship"]

Create THREE separate programs, each with their relevant learning content in whatYouWillLearn. Shared items like "Sanitization" (if it's a learning topic) should go in whatYouWillLearn for relevant programs, while marketing/included items go in quickFacts.

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
- socialLinks: social media handles/URLs (platform must be lowercase as specified in FORMATTING RULES: "instagram", "facebook", "whatsapp", etc.; handle, url, value)
- urls: Other URLs found
- locations: Org-level location strings (use proper title case formatting as specified in FORMATTING RULES)
- platformSignals: Platform UI elements (Sponsored, See more, etc.)

Do NOT attach global data to programs unless explicitly tied visually.

────────────────────────────────
PHASE 2 — BUSINESS IDENTIFICATION
────────────────────────────────

Based on the extracted evidence, identify the business(es) running this advertisement. Usually there is one business, but sometimes there are multiple names that could be the business name.

Provide an array of business name candidates as strings, ordered by likelihood:
- The most likely business name should be at index 0
- Additional candidate names (if any) should follow in descending order of likelihood
- If no business name can be determined, return an empty array []
- All business names must use proper title case formatting as specified in FORMATTING RULES

Use contact information, social links, locations, and any visible branding to determine the business name(s).

────────────────────────────────
FINAL INSTRUCTION
────────────────────────────────

Assume all images represent PROGRAMS.
Process ONLY the provided image(s).
CRITICAL: Separate registration fees from tuition fees in pricing structure.

`;

/**
 * Check if extraction file already exists for an image
 */
function extractionExists(imagePath: string): boolean {
  const imageFilename = path.basename(imagePath);
  const baseName = path.basename(imageFilename, path.extname(imageFilename));
  const outputFilename = `${baseName}-extraction.json`;
  const outputPath = path.join(EXTRACTIONS_DIR, outputFilename);
  return fs.existsSync(outputPath);
}

/**
 * Extract entities using Vercel AI SDK with Gemini
 */
async function extractWithGemini(
  imagePath: string,
  model: string = "gemini-2.0-flash-exp",
) {
  try {
    // Read image file as base64
    const imageBase64 = fs.readFileSync(imagePath, {
      encoding: "base64",
    });

    // Construct the full prompt
    const userPrompt = SYSTEM_PROMPT;

    // Call AI SDK generateText with structured output
    const result = await generateText({
      model: google(model),
      output: Output.object({
        schema: leadExtractionDocumentSchema,
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            {
              type: "image",
              image: imageBase64,
            },
          ],
        },
      ],
    });

    // The SDK validates and returns the structured output
    if (!result.output) {
      throw new Error("No structured output generated from model");
    }

    return result.output;
  } catch (error) {
    const errorMessage = (error as Error).message;

    // Handle structured output generation failures
    if (NoObjectGeneratedError.isInstance(error)) {
      throw new Error(
        `Failed to generate structured output: ${errorMessage}. Cause: ${error.cause?.toString() || "Unknown"}. Generated text: ${error.text?.substring(0, 300) || "None"}`,
      );
    }

    // Handle API key errors
    if (
      errorMessage.includes("API key") ||
      errorMessage.includes("GOOGLE_GENERATIVE_AI_API_KEY")
    ) {
      throw new Error(
        `Google Generative AI API key not found. Set GOOGLE_GENERATIVE_AI_API_KEY environment variable. Original error: ${errorMessage}`,
      );
    }

    throw error;
  }
}

/**
 * Process a single image
 */
async function processImage(
  imagePath: string,
  model: string = "gemini-2.0-flash-exp",
) {
  const imageFilename = path.basename(imagePath);

  console.log(`🔍 Processing ${imageFilename}...`);

  try {
    const extracted = await extractWithGemini(imagePath, model);

    // Validate structure using Zod schema (additional validation, SDK already validates)
    const validation = validateExtraction(extracted);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.error}`);
    }

    const baseName = path.basename(imageFilename, path.extname(imageFilename));
    const outputFilename = `${baseName}-extraction.json`;
    const outputPath = path.join(EXTRACTIONS_DIR, outputFilename);

    fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2) + "\n");
    console.log(`✅ Saved extraction to ${outputFilename}`);

    console.log(`✨ Successfully processed ${imageFilename}`);
    return { success: true, imageFilename, outputFilename };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return { success: false, imageFilename, error: errorMessage };
  }
}

/**
 * Process a single image with retry logic and exponential backoff
 */
async function processImageWithRetry(
  imagePath: string,
  model: string = "gemini-2.0-flash-exp",
  maxRetries = 3,
): Promise<{
  success: boolean;
  imageFilename: string;
  outputFilename?: string;
  error?: string;
}> {
  const imageFilename = path.basename(imagePath);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await processImage(imagePath, model);

    if (result.success) {
      return result;
    }

    // Check if it's a rate limit/quota error
    const isRateLimit =
      result.error?.includes("quota") ||
      result.error?.includes("rate limit") ||
      result.error?.includes("exceeded") ||
      result.error?.toLowerCase().includes("rate");

    if (isRateLimit && attempt < maxRetries) {
      const delay = 2 ** attempt * 1000; // Exponential backoff: 2s, 4s, 8s
      console.log(
        `⏳ Rate limited. Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    // If not a rate limit error or max retries reached, return the error
    if (attempt === maxRetries) {
      console.error(
        `❌ Error processing ${imageFilename} after ${maxRetries} attempts:`,
        result.error,
      );
    }
    return result;
  }

  return {
    success: false,
    imageFilename,
    error: "Max retries exceeded",
  };
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
  .option("-m, --model <model>", "Gemini model to use", "gemini-2.0-flash-exp")
  .argument(
    "[images...]",
    "Image file paths to process (default: all unprocessed images)",
  )
  .action(async (imagePaths: string[], options: { model?: string }) => {
    const model = options.model || "gemini-2.0-flash-exp";
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

    const unprocessedImages = paths.filter((imagePath) => {
      const imageFilename = path.basename(imagePath);
      if (extractionExists(imagePath)) {
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

    // Process images sequentially with delays and retry logic
    const results: Array<{
      success: boolean;
      imageFilename: string;
      outputFilename?: string;
      error?: string;
    }> = [];
    for (let i = 0; i < unprocessedImages.length; i++) {
      const imagePath = unprocessedImages[i];
      if (!imagePath) continue;

      if (!fs.existsSync(imagePath)) {
        console.error(`❌ Image not found: ${imagePath}`);
        results.push({
          success: false,
          imageFilename: path.basename(imagePath),
          error: "File not found",
        });
        continue;
      }

      const result = await processImageWithRetry(imagePath, model);
      results.push(result);

      // Add delay between requests to avoid rate limits (except for the last one)
      if (i < unprocessedImages.length - 1) {
        const delay = 2000; // 2 seconds between requests
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log("\n🎉 Processing complete!");
    console.log(`✅ Successful: ${successful}`);
    if (failed > 0) {
      console.log(`❌ Failed: ${failed}`);
      process.exit(1);
    }
  });
