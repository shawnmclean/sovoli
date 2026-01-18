# @sovoli/cli

CLI tool for Sovoli data management and media operations.

## Installation

The CLI is part of the monorepo and can be used after building:

```bash
pnpm install
pnpm --filter @sovoli/cli build
```

## Usage

After building, you can use the CLI via:

```bash
pnpm --filter @sovoli/cli build
node "packages/cli/dist/cli.js" <command>
```

Or add a script to root `package.json`:

```json
{
  "scripts": {
    "cli": "node packages/cli/dist/cli.js"
  }
}
```

Then use: `pnpm cli <command>`

## Commands

### `extract-leads [images...]`

Extract lead entities from ad images using Gemini CLI.

**Examples:**
```bash
# Process all unprocessed images
pnpm cli extract-leads

# Process specific images
pnpm cli extract-leads "data/leads/inputs/images/IMG_6245.PNG"
```

### `upload-media <file-path> <org-path>`

Upload media files to Cloudinary.

**Examples:**
```bash
pnpm cli upload-media "path/to/image.jpg" "o/org-name/photos"
```

### `sync-posthog-leads`

Sync leads from PostHog for a tenant and program. Queries PostHog for "Lead" events from the last 30 days, fetches person properties to get contact information, and automatically updates the leads JSON file.

**Required Environment Variables:**
- `POSTHOG_API_KEY`: Your PostHog personal API key (with `query:read` scope)
- `POSTHOG_PROJECT_ID`: Your PostHog project ID

**Options:**
- `-t, --tenant <tenant>`: Tenant username (e.g., `healingemeraldwellness`)
- `-p, --program-id <programId>`: Program ID (e.g., `hew-massage-therapy`)
- `--project-id <projectId>`: Override PostHog project ID (optional)
- `--dry-run`: Show what would be updated without making changes

**Examples:**
```bash
# Sync leads for Healing Emerald Wellness Massage Therapy program
pnpm cli sync-posthog-leads --tenant healingemeraldwellness --program-id hew-massage-therapy

# Dry run to preview changes
pnpm cli sync-posthog-leads --tenant healingemeraldwellness --program-id hew-massage-therapy --dry-run
```

### `meta-ads-apply-spec --file <spec.json>`

Create a **PAUSED** Meta (Facebook/Instagram) campaign + ad sets + ads from a single JSON spec file (plus local image files referenced by path). This is designed as a pipeline step where a web UI can generate the JSON, and the CLI applies it.

**Required Environment Variables:**
- Your spec references a token **by env var name** (e.g. `META_CLIENT_SYSTEM_USER_TOKEN`). Make sure that env var is set before running.

**Examples:**
```bash
# Validate the spec + referenced image files (no API calls)
pnpm cli meta-ads-apply-spec --file data/meta-ads/drafts/my-draft/spec.json --dry-run

# Apply the spec (creates everything in PAUSED status)
pnpm cli meta-ads-apply-spec --file data/meta-ads/drafts/my-draft/spec.json

# Optionally write results.json next to the spec
pnpm cli meta-ads-apply-spec --file data/meta-ads/drafts/my-draft/spec.json --write-results
```

**Spec layout (recommended):**

```
data/meta-ads/
  drafts/
    my-draft/
      spec.json
      assets/
        image-1.png
        image-2.jpg
```

**Example spec (schemaVersion: 1):**

```json
{
  "schemaVersion": 1,
  "meta": {
    "apiVersion": "v24.0",
    "adAccountId": "act_123456789012345",
    "systemUserTokenEnv": "META_CLIENT_SYSTEM_USER_TOKEN"
  },
  "campaign": {
    "name": "HEW | Massage Therapy | Traffic | Jan 2026",
    "objective": "OUTCOME_TRAFFIC",
    "specialAdCategories": [],
    "budget": { "dailyBudget": 5000 }
  },
  "adSets": [
    {
      "ref": "hew-traffic-guyana",
      "name": "HEW | Guyana | Link Clicks",
      "optimizationGoal": "LINK_CLICKS",
      "billingEvent": "LINK_CLICKS",
      "targeting": {
        "geo_locations": { "countries": ["GY"] },
        "age_min": 18,
        "age_max": 65
      }
    }
  ],
  "ads": [
    {
      "name": "HEW | Massage Therapy | Ad 1",
      "adSetRef": "hew-traffic-guyana",
      "creative": {
        "pageId": "1234567890",
        "linkUrl": "https://www.sovoli.com/w/healingemeraldwellness/programs/massage-therapy",
        "message": "Start your journey in Massage Therapy.",
        "headline": "View the program details",
        "description": "Limited seats available",
        "imagePath": "data/meta-ads/drafts/my-draft/assets/ad-1.png",
        "callToActionType": "LEARN_MORE"
      }
    }
  ]
}
```

## Development

```bash
# Build
pnpm --filter @sovoli/cli build

# Watch mode
pnpm --filter @sovoli/cli dev

# Type check
pnpm --filter @sovoli/cli typecheck
```

## Adding New Commands

1. Create a new file in `src/commands/`
2. Export a `Command` instance
3. Import and add it to `src/cli.ts`

Example:
```typescript
// src/commands/my-command.ts
import { Command } from "commander";

export const myCommand = new Command("my-command")
  .description("My command description")
  .action(() => {
    // Command logic
  });
```
