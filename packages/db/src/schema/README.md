All files in this directory must be isolated from other non-schema files.

This allows the zod schemas to be imported by expo apps who is importing ts-rest contracts that are inheriting from these zod schemas.

## Naming Conventions

- Tables: singular, snake_case
- Columns: snake_case (going from what authjs.dev uses, so keeping consistency)
- Drizzle Entity: PascalCase
