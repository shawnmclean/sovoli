# Scripts

Convert knowledge items from database to MDX files.

## Quick Start

```bash
# Step 1: Fetch from database
node scripts/fetch-from-db.js

# Step 2: Convert to MDX
node scripts/convert-to-mdx.js
```

## Scripts

### fetch-from-db.js

Fetches all knowledge items from database and saves to `db-result.json`

- Reads `POSTGRES_URL` from `.env` file
- Queries all public notes for user 'shawn'
- Includes media assets with Cloudinary URLs

### convert-to-mdx.js

Converts `db-result.json` to MDX files

- Reads JSON from database query
- Converts TipTap JSON content to Markdown
- Creates MDX files with YAML frontmatter
- Output: `src/modules/data/organisations/users/shawn/notes/*.mdx`

## Requirements

Make sure you have `POSTGRES_URL` in your `.env` or `.env.local` file:

```
POSTGRES_URL=postgresql://...
```

## Output

Each MDX file contains:

- ✅ YAML frontmatter with all metadata
- ✅ Markdown content (converted from TipTap JSON)
- ✅ Cloudinary photo URLs in frontmatter
- ✅ Proper slug-based file naming
