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
- **Org Path**: The folder structure in Cloudinary (e.g., `tenants/healing-emerald`).

## 3. Constraints

- **Size Limit**: 100MB per file.
- **Method**: Do **NOT** use generic MCP tools for Cloudinary. Use the script above.
