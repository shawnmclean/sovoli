# Program Management Skill

This skill provides guidance for creating and updating programs in the Sovoli platform.

## When to Use

Use this skill when:
- Creating a new program for a tenant organization
- Updating an existing program (details, pricing, cycles, supply lists)
- Adding program cycles or updating cycle configurations
- Managing program supply lists and requirements

## Key Concepts

1. **Programs are JSON-based**: All program data is stored in JSON files within organization directories
2. **Multi-file structure**: Programs require updates across multiple files (program definition, cycles, groups)
3. **Items must exist first**: Supply list items must exist in the global items database before being added
4. **Cycle-based pricing**: Pricing is configured at the program cycle level, not the program level

## Quick Reference

- **Program Definition**: `{program-group}-academic.json`
- **Cycles**: `cycles.json`
- **Groups**: `program-groups.json`
- **Items Database**: `apps/sovoli.com/src/modules/data/items/`

## Process

1. Confirm tenant and program details
2. Update/create program definition
3. Update cycle configuration
4. Update program groups (if needed)
5. Verify supply list items exist
6. Validate all configurations

See [PROGRAM-CREATION-GUIDE.md](./PROGRAM-CREATION-GUIDE.md) for detailed instructions.
