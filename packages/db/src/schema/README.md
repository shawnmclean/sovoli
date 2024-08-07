All files in this directory must be isolated from other non-schema files.

This allows the zod schemas to be imported by expo apps who is importing ts-rest contracts that are inheriting from these zod schemas.
