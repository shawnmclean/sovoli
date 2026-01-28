# Engineering Protocol

## 1. Repository Structure

This is a **monorepo** using pnpm workspaces and Turbo.

- **Apps**: `apps/sovoli.com` - Next.js 15.5.7 (App Router)
- **Packages**:
    - `@sovoli/db`: Database client (Mock)
    - `@sovoli/ui`: Shared UI (HeroUI)
    - Configs: `@sovoli/eslint-config`, `@sovoli/typescript-config`

## 2. Tech Stack

- **Framework**: Next.js 15.5.7, React 19, Tailwind CSS 4.1.13
- **Language**: TypeScript 5.9.3 (Strict)
- **State/Data**: Trigger.dev (Jobs), Cloudinary (Media), PostHog (Analytics)

## 3. Development Setup

**Prerequisites**: Node.js >= 18, pnpm 10.25.0

**Commands**:
- `pnpm dev`: Start dev server
- `pnpm build`: Build all
- `pnpm lint` / `pnpm typecheck` / `pnpm format`: Quality checks

## 4. Code Style & Conventions

- **Strict TypeScript**: No `any`. Use `import type`.
- **ESLint**: No default exports. Use `env.ts` for environment vars.
- **Prettier/Biome**: 2 space indentation.
- **UI**: Use `@sovoli/ui` components.
- **UX**: All CTA buttons must be rounded pills: `<Button radius="full">`.

## 5. Quality Checks (Run After Changes)

**MANDATORY**: After making any TypeScript/JavaScript code changes, you **MUST** run these checks before marking tasks complete. You can use the **`/done`** workflow to run all of these automatically.

1. `pnpm typecheck` - **CRITICAL**: Run this first to catch type errors
2. `pnpm lint` - Check for linting issues
3. `pnpm format` - Ensure code formatting is correct
4. `pnpm build` - Verify compilation succeeds

**Automation**: Run `view_file` on `.agent/workflows/done.md` (or use `/done` if your interface supports it) to execute these checks.

**Exception**: Only skip if explicitly told by the user or if changes are purely documentation/markdown files.

Type checking is especially important because TypeScript errors can break the build and cause runtime issues. Always fix type errors before proceeding.

## 6. Important Paths

- **Env**: `apps/sovoli.com/src/env.ts`
- **DB**: `packages/db/src/`
- **UI**: `packages/ui/src/components/`
- **App**: `apps/sovoli.com/src/`
