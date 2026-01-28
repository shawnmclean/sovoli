---
name: typescript-quality-gate
description: Mandatory quality checks for TypeScript/JavaScript changes. This skill ensures that all code changes are type-checked, linted, and formatted before completion. Triggers on wrapping up any task that modifies .ts, .tsx, .js, or .jsx files.
---

# TypeScript Quality Gate

This skill defines the mandatory "Definition of Done" for all AI agents working on this codebase.

## When to Apply

You **MUST** follow these steps whenever you are preparing to submit or wrap up a task that involves changes to:
- TypeScript files (`.ts`, `.tsx`)
- JavaScript files (`.js`, `.jsx`)
- Any package configuration that affects the build

## Mandatory Quality Checks

Before marking a task as complete, you must ensure the following:

### 1. Type Integrity
- **Command**: `pnpm typecheck`
- **Goal**: Zero TypeScript errors in all workspaces.
- **Why**: Type errors can break the production build and cause runtime crashes in a strict TypeScript environment.

### 2. Code Quality (Linting)
- **Command**: `pnpm lint`
- **Goal**: No linting violations.
- **Why**: Ensures adherence to the project's coding standards and catches common bugs.

### 3. Formatting
- **Command**: `pnpm format`
- **Goal**: Files follow the project's Prettier/Biome configuration.
- **Why**: Keeps the codebase clean and avoids unnecessary diff noise in future PRs.

### 4. Build Verification
- **Command**: `pnpm build`
- **Goal**: Successful compilation of the affected application/package.
- **Why**: Final confirmation that the changes work within the full build pipeline.

## Automated Workflow

You can run these checks automatically using the `/done` workflow:
`view_file` on `e:\Developers\sovoli\.agent\workflows\done.md` and follow the `turbo` commands.
