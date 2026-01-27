# Media Management Protocol

## 1. Overview

Media files are stored in Cloudinary. We generally avoid using MCP tools for direct uploads in favor of our custom script.

## 2. Upload Workflow

**Always use the upload script.**

Command:
```bash
pnpm with-env node apps/sovoli.com/scripts/upload-media.mjs <file-path> <org-path>
```

- **File Path**: Local path to the file.
- **Org Path**: **MUST follow the format `o/<tenant-username>/[subdirectories]`**
  - Example: `o/healingemeraldwellness/team/alicia`
  - Example: `o/littlefishkindergarten/programs`
  - **DO NOT use old category-based paths** like `o/vocational-school/jamaica/healingemeraldwellness/...`

**Required Path Format:**
- All media files MUST be uploaded to paths starting with `o/<tenant-username>/`
- The tenant username comes from the `username` field in the organization's `org.json` file
- Subdirectories can be added after the tenant username (e.g., `/team`, `/programs`, `/services`, `/gallery`)

## 3. Constraints

- **Size Limit**: 100MB per file.
- **Method**: Do **NOT** use generic MCP tools for Cloudinary. Use the script above.
