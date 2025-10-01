/**
 * Convert knowledge items from database JSON to MDX files
 *
 * USAGE:
 * 1. Save database query results to: scripts/db-result.json
 * 2. Run: node scripts/convert-to-mdx.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbResultPath = path.join(__dirname, "db-result.json");
const outputDir = path.join(
  __dirname,
  "..",
  "src",
  "modules",
  "data",
  "organisations",
  "users",
  "shawn",
  "notes",
);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Convert TipTap JSON to Markdown
 */
function tiptapToMarkdown(jsonContent) {
  try {
    const content =
      typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;

    function processNode(node) {
      if (!node) return "";
      const { type, content: children, attrs, marks, text } = node;

      if (type === "text") {
        let result = text || "";
        if (marks) {
          marks.forEach((mark) => {
            if (mark.type === "bold") result = `**${result}**`;
            if (mark.type === "italic") result = `*${result}*`;
            if (mark.type === "code") result = `\`${result}\``;
          });
        }
        return result;
      }

      const childContent = children ? children.map(processNode).join("") : "";

      switch (type) {
        case "doc":
          return childContent;
        case "paragraph":
          return childContent + "\n\n";
        case "heading":
          return `${"#".repeat(attrs?.level || 1)} ${childContent}\n\n`;
        case "blockquote":
          return (
            childContent
              .split("\n")
              .map((line) => `> ${line}`)
              .join("\n") + "\n\n"
          );
        case "bulletList":
        case "orderedList":
          return childContent;
        case "listItem":
          return `- ${childContent.trim()}\n`;
        case "codeBlock":
          return `\`\`\`\n${childContent}\`\`\`\n\n`;
        case "horizontalRule":
          return "---\n\n";
        default:
          return childContent;
      }
    }

    return processNode(content).trim();
  } catch (error) {
    console.error("Error converting content:", error);
    return jsonContent;
  }
}

/**
 * Convert one knowledge item to MDX
 */
function convertToMDX(item) {
  console.log(`Converting: ${item.title}`);

  const mediaAssets = Array.isArray(item.media_assets) ? item.media_assets : [];
  const cover = mediaAssets.find((a) => a.placement === "cover");
  const inline = mediaAssets.filter((a) => a.placement === "inline");

  const frontmatter = {
    id: item.id,
    title: item.title,
    description: item.description || "",
    type: item.type,
    slug: item.slug,
    isOrigin: item.is_origin,
    isPublic: item.is_public,
    isDraft: item.is_draft,
    ...(item.chapter_number && { chapterNumber: item.chapter_number }),
    ...(item.verified_date && { verifiedDate: item.verified_date }),
    ...(item.query && { query: item.query }),
    queryType: item.query_type || "query",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    userId: item.username,
  };

  if (cover && (cover.bucket || cover.cloudinaryUrl)) {
    frontmatter.coverPhoto = {
      bucket: cover.bucket,
      id: cover.id,
      path: cover.path,
      url: cover.cloudinaryUrl,
      alt: cover.name || item.title,
      caption: cover.notes || "",
      category: "default",
    };
  }

  if (inline.length > 0) {
    frontmatter.inlinePhotos = inline.map((a) => ({
      bucket: a.bucket,
      id: a.id,
      path: a.path,
      url: a.cloudinaryUrl || "",
      alt: a.name || "",
      caption: a.notes || "",
      category: "default",
    }));
  }

  const markdown = tiptapToMarkdown(item.content);
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");

  const mdx = `---\n${yaml}\n---\n\n${markdown}\n`;
  const filePath = path.join(outputDir, `${item.slug}.mdx`);

  fs.writeFileSync(filePath, mdx);
  return filePath;
}

/**
 * Main
 */
async function main() {
  console.log("🚀 Converting database results to MDX...");
  console.log("=".repeat(50));

  if (!fs.existsSync(dbResultPath)) {
    console.error(`\n❌ File not found: ${dbResultPath}`);
    console.log("\n💡 Save your database query result to:");
    console.log(`   ${dbResultPath}\n`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dbResultPath, "utf8"));
  const items = Array.isArray(data) ? data : data.data || [];

  console.log(`📖 Found ${items.length} items\n`);

  items.forEach(convertToMDX);

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Converted ${items.length} items to MDX!`);
  console.log(`📁 Location: ${outputDir}\n`);
}

main();
