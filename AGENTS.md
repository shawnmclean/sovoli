# Project Instructions for AI Agents

This document provides essential information for AI agents working on the Sovoli codebase.

## Project Overview

Sovoli is a monorepo project built with Next.js, TypeScript, and React. The codebase uses pnpm workspaces and Turbo for task orchestration.

## Repository Structure

This is a **monorepo** organized as follows:

- **Apps**: `apps/sovoli.com` - Main Next.js 15.5.7 application with App Router
- **Packages**: 
  - `@sovoli/db` - Database client and schema (currently mock/placeholder)
  - `@sovoli/ui` - Shared UI component library, built on HeroUI
  - `@sovoli/eslint-config` - Shared ESLint configuration
  - `@sovoli/typescript-config` - Shared TypeScript configuration
  - `@sovoli/prettier-config` - Shared Prettier configuration

## Key Technologies

- **Framework**: Next.js 15.5.7 (App Router, Turbopack, MDX support)
- **UI**: React 19, Tailwind CSS 4.1.13
- **Language**: TypeScript 5.9.3 (strict mode)
- **Media**: Cloudinary for media storage
- **Background Jobs**: Trigger.dev
- **Authentication**: None as yet
- **Analytics**: PostHog
- **Observability**: OpenTelemetry

## Development Setup

### Prerequisites

- **Node.js**: >= 18
- **Package Manager**: pnpm 10.25.0 (exact version required, specified in `packageManager` field)

### Initial Setup

1. Install dependencies: `pnpm install` (run at root)
2. Set up environment variables: Copy `.env.example` to `.env` at root level
   - The `.env` file is required for build and testing
   - Environment variables are loaded via `dotenv-cli` using `pnpm with-env` command

### Development Commands

- `pnpm dev` - Start development server (runs Next.js with Turbo)
- `pnpm build` - Build all packages and apps
- `pnpm start` - Start production server (in `apps/sovoli.com`)

## Quality Checks (Run After Changes)

**Always run these checks after making code changes:**

- `pnpm lint` - Runs ESLint across all packages via Turbo
- `pnpm typecheck` - Runs TypeScript compiler type checking via Turbo
- `pnpm format` - Formats code with Prettier
- `pnpm build` - Builds the project to verify compilation

All checks should pass before committing changes.

## Build System

- **Turbo** handles task orchestration, caching, and dependencies
- Task dependencies are defined in `turbo.json`
- Build outputs: `.next/`, `dist/`, `.expo/`, `.output/`, `.vercel/output/`
- Available tasks: `build`, `dev`, `lint`, `typecheck`, `clean`

## Code Style & Conventions

### TypeScript

- **Strict mode** enabled with `noUncheckedIndexedAccess`
- Use proper types, avoid `any` type
- Type imports should be separate: `import type { ... }`

### ESLint Rules

- **No default exports** - Use named exports only (`import/no-default-export`)
- **Consistent type imports** - Type imports must be separate (`@typescript-eslint/consistent-type-imports`)
- **Environment variables** - Must use `env.ts` instead of direct `process.env` access
  - Import: `import { env } from '~/env'`
  - ESLint restricts direct `process.env` usage

### Prettier

- Automatic import sorting
- Tailwind CSS class sorting
- Tab indentation

### Biome

- Formatter enabled with tab indentation
- Linter enabled with recommended rules
- Automatic import organization

### General

- Use UI components from `@sovoli/ui` when available
- Use default Tailwind theme colors (no custom colors)
- Follow existing patterns in the codebase

## Important File Locations

- **Environment config**: `apps/sovoli.com/src/env.ts` (validated with `@t3-oss/env-nextjs`)
- **Database**: `packages/db/src/` (currently mock/placeholder)
- **UI components**: `packages/ui/src/components/`
- **App source**: `apps/sovoli.com/src/`
- **Documentation**: `docs/` (see `docs/AGENTS.md` for structure)
- **Media upload script**: `apps/sovoli.com/scripts/upload-media.mjs`

## Media Management

### Uploading Media Files

**Always use the upload script instead of MCP tools** for uploading media to Cloudinary:

1. **Upload media using the script**:
   ```bash
   pnpm with-env node apps/sovoli.com/scripts/upload-media.mjs <file-path> <org-path>
   ```

   Examples:
   - `pnpm with-env node apps/sovoli.com/scripts/upload-media.mjs "tmp/video.mp4" "o/fitright/programs/sewing-class"`
   - `pnpm with-env node apps/sovoli.com/scripts/upload-media.mjs "E:\path\to\image.jpg" "o/cove-primary/photos"`

2. **Add media entries to organization's media.json**:
   - Copy the "Media Object for JSON" output from the script
   - Add a unique `id` field following the organization's naming pattern
   - Add the entry to the `media` array in the organization's `media.json` file
   - Location: `apps/sovoli.com/src/modules/data/organisations/<org-path>/media.json`

3. **Reference media in programs/projects**:
   - Add the media `id` to the appropriate `galleryIds` array in program or project JSON files

### File Size Limitations

- **Cloudinary upload limit**: 100MB per file
- Files over 100MB will fail to upload even with the large file upload feature
- For files exceeding 100MB, compress them first or use Cloudinary's async upload API with a signed upload preset

## Package Management

- Uses **workspace protocol** (`workspace:*`) for internal package dependencies
- **Catalog pattern** for shared dependency versions in `pnpm-workspace.yaml`
- Internal packages are referenced as: `@sovoli/db`, `@sovoli/ui`, etc.


## Documentation

Comprehensive documentation is located in `docs/`. See `docs/AGENTS.md` for:
- Architecture Decision Records (ADRs)
- Data layer documentation
- Product documentation
- How to navigate the docs

## Notes

- Database client is currently a mock/placeholder (`packages/db/src/client.ts`)
- Environment validation happens at build time via `jiti` in `next.config.js`
- Next.js build disables ESLint during build (handled separately in CI)
