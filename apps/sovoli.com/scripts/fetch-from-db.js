/**
 * Fetch knowledge items from database and save to db-result.json
 * Uses POSTGRES_URL from .env file
 *
 * USAGE: node scripts/fetch-from-db.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

// Allow self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from workspace root
const workspaceRoot = path.join(__dirname, "..", "..", "..");
dotenv.config({ path: path.join(workspaceRoot, ".env.local") });
dotenv.config({ path: path.join(workspaceRoot, ".env") });
// Also try app-level .env files
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const outputPath = path.join(__dirname, "db-result.json");

const QUERY = `
SELECT 
  k.id,
  k.title,
  k.description,
  k.type,
  k.content,
  k.slug,
  k.is_origin,
  k.is_public,
  k.is_draft,
  k.chapter_number,
  k.verified_date,
  k.query,
  k.query_type,
  k.created_at,
  k.updated_at,
  k.user_id,
  u.username,
  COALESCE(
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', ma.id,
        'name', ma.name,
        'mimeType', ma.mime_type,
        'host', ma.host,
        'bucket', ma.bucket,
        'path', ma.path,
        'cloudinaryUrl', ma.download_link,
        'order', kma.order,
        'placement', kma.placement,
        'notes', kma.notes,
        'createdAt', ma.created_at,
        'updatedAt', ma.updated_at
      )
    ) FILTER (WHERE ma.id IS NOT NULL),
    '[]'::json
  ) as media_assets
FROM knowledge k
JOIN "user" u ON k.user_id = u.id
LEFT JOIN knowledge_media_asset kma ON k.id = kma.knowledge_id
LEFT JOIN media_asset ma ON kma.media_asset_id = ma.id
WHERE u.username = 'shawn' 
  AND k.type = 'collection'
  AND k.is_public = true
GROUP BY k.id, k.title, k.description, k.type, k.content, k.slug, 
         k.is_origin, k.is_public, k.is_draft, k.chapter_number, 
         k.verified_date, k.query, k.query_type, k.created_at, 
         k.updated_at, k.user_id, u.username
ORDER BY k.created_at DESC;
`;

async function main() {
  console.log("🚀 Fetching knowledge items from database...");
  console.log("=".repeat(50));

  // Check for connection string from various sources
  const connectionString =
    process.argv[2] || // Command line argument
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    console.error("\n❌ Missing database connection string");
    console.error("\nProvide it via:");
    console.error(
      "  1. Command line: node scripts/fetch-from-db.js 'postgresql://...'",
    );
    console.error(
      "  2. Environment: POSTGRES_URL=... node scripts/fetch-from-db.js",
    );
    console.error("  3. .env file: POSTGRES_URL=postgresql://...\n");
    process.exit(1);
  }

  console.log("✅ Using database connection");

  const client = new pg.Client({
    connectionString,
    ssl: connectionString.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("✅ Connected to database");

    const result = await client.query(QUERY);
    console.log(`📖 Found ${result.rows.length} knowledge items`);

    fs.writeFileSync(outputPath, JSON.stringify(result.rows, null, 2));
    console.log(`💾 Saved to: ${outputPath}`);

    console.log("\n" + "=".repeat(50));
    console.log("✅ Fetch complete!");
    console.log("\nNext step: node scripts/convert-to-mdx.js\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
