# Plan: Move supplier recommendations from program to cycle

Suppliers change **per cycle** (availability, pricing, contracts), but the UI for “What to Bring / Supplies” is currently built from a **program** context and uses **org-level** supplier recommendations.

This doc proposes a migration plan to make the suppliers list **cycle-scoped** (i.e. `ProgramCycle`), with a safe rollout and fallbacks.

## Current state (what exists today)

- **Programs** live in per-org academic data.
  - TS-based orgs (e.g. Modern Academy) define `Program` objects directly in `apps/sovoli.com/src/modules/data/organisations/**/academics/programs/*.ts`.
  - JSON-based orgs (e.g. Fitright) use `*academic.json`, parsed by `apps/sovoli.com/src/modules/data/organisations/utils/parseAcademicModule.ts`.
- **Cycles** live in `apps/sovoli.com/src/modules/data/organisations/**/cycles.json`.
  - `programCycles[]` are validated in `apps/sovoli.com/src/modules/data/organisations/utils/parseCyclesModule.ts`.
  - Programs reference cycles via `cycleIds` (JSON) or `cycles: [...]` (TS).
- The **Supplies UI** is program-driven:
  - `apps/sovoli.com/src/app/(tenants)/w/[username]/programs/[slug]/components/supplies/useProgramSupplies.ts` loads suppliers from `orgInstance.org.supplierRecommendations` and then prices items using supplier catalogs.
  - It does **not** currently look at the selected cycle, even though cycle selection exists in `ProgramCycleSelectionContext`.

## Goal

- Make the “recommended suppliers” list **configurable per cycle**, so the supplies/pricing experience can change across cycles without editing the program definition.
- Preserve existing behavior for organizations/cycles that don’t specify cycle suppliers.

## Proposed data model change

### 1) Add supplier references to `ProgramCycle`

Add an optional field on the domain type:

- `ProgramCycle.supplierOrgUsernames?: string[]`

Why usernames?
- The rest of the system already treats `org.username` as the stable identifier.
- Cycles JSON already uses lightweight references (e.g. `teacherSlugs`, `academicCycleId`) and resolves them later.

### 2) Extend `cycles.json` schema

Extend the Zod schema in `parseCyclesModule.ts`:

- Add an optional `supplierOrgUsernames: string[]` to each `programCycles[]` entry.

This keeps supplier configuration with the entity that changes (the cycle), not the entity that stays stable (the program).

### 3) Keep org-level suppliers as a fallback (for now)

Do **not** immediately remove `org.supplierRecommendations`.

Instead define the runtime resolution precedence:

1. `selectedCycle.supplierOrgUsernames` (if present and non-empty)
2. `orgInstance.org.supplierRecommendations` (existing behavior)
3. `[]` (no suppliers)

This enables gradual data population and avoids breaking current pages.

## UI/runtime changes (implementation plan)

### 1) Make supplies depend on the selected cycle

Update `useProgramSupplies` to accept the selected cycle (or a “resolved suppliers list”):

- New signature option A (preferred):
  - `useProgramSupplies(program, orgInstance, selectedCycle)`
- New signature option B:
  - `useProgramSupplies(program, orgInstance, supplierOrgUsernames)`

Then update call sites in:

- `SuppliesSection.tsx`
- `SuppliesDetails.tsx`

Both components already receive `program` and `orgInstance`; cycle can be obtained via `useProgramCycleSelection()` (or passed down if server/client boundaries require it).

### 2) Supplier resolution logic

Implement a single resolver that converts usernames into `OrgInstance`s:

- Use the existing `ORGS` registry lookup pattern (already used in `useProgramSupplies.ts`).
- Behavior if a username can’t be resolved:
  - Log a warning (non-fatal)
  - Skip that supplier

### 3) Handle cycle switching correctly

When the user changes cycle:

- Recompute supplierData for items.
- Reset `selectedSuppliers` to “cheapest per item” under the new supplier set.

Practical note: today selection keys are based on `(reqIndex-itemIndex)` and are stable as long as `requirements` ordering doesn’t change. If requirements can change per cycle in the future, switch to a stable key (e.g. `itemId`) to avoid wrong selections carrying over.

## Data migration plan

### Phase 0 — Ship schema support + fallback

- Add `supplierOrgUsernames` to `ProgramCycle` type and cycles parsing.
- Keep UI behavior unchanged until data is present.

Exit criteria:
- All existing orgs load without errors.
- `cycles.json` continues to parse with and without the new field.

### Phase 1 — Populate cycle suppliers

For each organization:

- For each `programCycle` in `apps/sovoli.com/src/modules/data/organisations/**/cycles.json`:
  - Add `supplierOrgUsernames`.

Initial population strategy (to preserve current behavior):

- Seed `supplierOrgUsernames` from the current org default list:
  - `orgInstance.org.supplierRecommendations[].org.username`

Then adjust cycle-by-cycle where needed.

### Phase 2 — Switch UI to cycle-first precedence

- Update supplies UI to use the precedence rules:
  - cycle → org fallback

Exit criteria:
- Manually verify at least one org where two cycles show different suppliers.

### Phase 3 — Deprecate program/org-level supplier defaults (optional)

Once all orgs have cycle-level suppliers populated, choose one:

- **Option A (recommended):** keep `org.supplierRecommendations` as a default for newly created cycles.
- **Option B:** remove `org.supplierRecommendations` entirely and require cycles to specify suppliers.

## Validation / QA checklist

- Switching cycles updates:
  - supplier list
  - per-item prices
  - total price and supplier count
  - WhatsApp “Get Quote” supplier contact selection
- Missing data behavior:
  - cycle has no suppliers → falls back to org-level defaults
  - supplier username not found in `ORGS` → skipped with warning, UI still works
- Data correctness:
  - `supplierOrgUsernames` contains unique usernames
  - suppliers used for pricing actually have `catalogModule.items` for the relevant item IDs (otherwise they simply won’t appear for those items)

## Notes / follow-ups

- Today, “suppliers” are used only for **pricing and contact**; the required items list itself is still program-based (`program.requirements` or `program.standardProgramVersion.requirements`). This proposal intentionally changes only the supplier selection, not the requirements source.
- If, later, requirements also vary by cycle, add `ProgramCycle.requirementsOverride` (or a similar mechanism) and update the selection key to be item-id based.
