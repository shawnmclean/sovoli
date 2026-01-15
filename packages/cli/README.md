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
pnpm --filter @sovoli/cli sovoli <command>
```

Or add a script to root `package.json`:

```json
{
  "scripts": {
    "cli": "pnpm --filter @sovoli/cli sovoli"
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
