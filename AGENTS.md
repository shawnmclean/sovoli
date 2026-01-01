# Project Instructions for AI Agents

## 🚨 Business Protocol (READ FIRST) 🚨

**You are working for a real startup. Your code costs money. Your time costs money.**

Before starting ANY task, you must:
1.  **Read [STRATEGY.md](file:///e:/Developers/sovoli/STRATEGY.md)**: Ensure your work aligns with the current Pilots (Healing Emerald, FitRight) and KPIs (10 Tenants).
2.  **Read [TASKS.md](file:///e:/Developers/sovoli/TASKS.md)**: Check if there is high-priority work you should be doing instead, or if your task is already listed.

**The Golden Rule**: *If it doesn't help us get 10 tenants or optimize the current pilots, DO NOT BUILD IT without explicit permission.*


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
- 2 space indentation

### Biome

- Formatter enabled with 2 space indentation
- Linter enabled with recommended rules
- Automatic import organization

### General

- Use UI components from `@sovoli/ui` when available
- Use default Tailwind theme colors (no custom colors)
- Follow existing patterns in the codebase

### UI/UX Guidelines

- **CTA Buttons**: All Call-to-Action (CTA) buttons must use rounded pill style by setting `radius="full"` on the Button component
  - This improves conversions on marketing pages
  - Example: `<Button radius="full" color="primary">Get Started</Button>`

## Important File Locations

- **Environment config**: `apps/sovoli.com/src/env.ts` (validated with `@t3-oss/env-nextjs`)
- **Database**: `packages/db/src/` (currently mock/placeholder)
- **UI components**: `packages/ui/src/components/`
- **App source**: `apps/sovoli.com/src/`
- **Documentation**: `docs/` (see `docs/AGENTS.md` for structure)
- **Media upload script**: `apps/sovoli.com/scripts/upload-media.mjs`

## Media Management

For detailed instructions on uploading media files and adding them to programs, see:
**`docs/uploading-media.md`**

**Quick reference:**
- Always use the upload script: `pnpm with-env node apps/sovoli.com/scripts/upload-media.mjs <file-path> <org-path>`
- Never use MCP tools for Cloudinary uploads
- File size limit: 100MB per file

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
