---
description: Run quality checks before finishing a task (Definition of Done)
---

// turbo-all

This workflow ensures that all code changes meet the project's quality standards before the task is considered complete.

1. **Type Check**: Run strict TypeScript type checking.
   `pnpm typecheck`

2. **Lint**: Run linting to catch potential errors and style issues.
   `pnpm lint`

3. **Format**: Ensure all modified files are properly formatted.
   `pnpm format`

4. **Build**: Verify that the application builds successfully.
   `pnpm build`
