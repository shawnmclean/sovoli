# Project Instructions for AI Agents

## 🚨 STOP AND READ THIS FIRST 🚨

**MANDATORY**: You **MUST** read the [Business Protocol](docs/protocols/BUSINESS.md) before doing anything else, including **creating an implementation plan**.

> **Why?** It contains the "Scrappy Protocol" and the **Mandatory Implementation Plan Template**. If you skip this, you will be rejected.
> **Rule**: Even if you think your task is purely technical, purely media-related, or small—**READ THE BUSINESS PROTOCOL FIRST**.

---

## 📂 Documentation Router

After reading the Business Protocol, load **ONLY** the specific context you need for your task. Do not read everything if you don't need it.

### 1. Context, Strategy & Tasks (Start Here - Required for Plans)
**Read**: [docs/STRATEGY.md](docs/STRATEGY.md)
*   *Contains: Current OKRs, Active Pilots, North Star Metrics, and **Master Task List**.*

### 3. Technical & Coding Tasks
**Read**: [Engineering Protocol](docs/protocols/ENGINEERING.md)
*   *Contains: Tech stack, Monorepo structure, Commands, Code style, Quality checks.*

### 4. Media & Upload Tasks
**Read**: [Media Protocol](docs/protocols/MEDIA.md)
*   *Contains: Upload scripts, Cloudinary rules, Size limits.*

### 5. Product & Data Tasks
**Read**: [docs/README.md](docs/README.md)
*   *Contains: Links to Data Layer docs, Product documentation, and navigating the `docs/` folder.*

### 6. Lead Data Sync Tasks
**Read**: [PostHog Lead Data Sync](docs/leads/posthog-sync.md)
*   *Contains: How to sync lead data from PostHog to JSON files using the CLI command `sync-posthog-leads` or manual scripts.*

### 7. Tenant Domain Setup Tasks
**See**: Examples below for setting up custom tenant domains.
*   **Existing tenants with custom domains**: Modern Academy (`ma.edu.gy`), FitRight (`fitright.gy`), Healing Emerald Wellness (`hewja.com`)
*   **Pattern 1 (JSON-based)**: For tenants using `website.json` (e.g., FitRight, Healing Emerald Wellness)
    *   Add `"domain"` field to `website.json` under `website` object: `"domain": "www.{domain}"`
    *   Format: Use `www.{domain}` prefix to match existing patterns
    *   Example: `apps/sovoli.com/src/modules/data/organisations/vocational-school/guyana/fitright/website.json`
*   **Pattern 2 (TypeScript-based)**: For tenants using `constants.ts` and `website.ts` (e.g., Modern Academy)
    *   Define `ORG_DOMAIN` in `constants.ts`: `export const ORG_DOMAIN = env.NODE_ENV === "development" ? "tenant.localhost:3000" : "www.{domain}"`
    *   Reference in `website.ts`: Import `ORG_DOMAIN` and set `domain` and `url` fields
    *   Example: `apps/sovoli.com/src/modules/data/organisations/private-schools/guyana/modernacademy/`
*   **Domain routing**: Automatically handled by `apps/sovoli.com/src/modules/data/organisations/index.ts` which builds `DOMAIN_TO_USERNAME` map from `websiteModule.website.domain`. No code changes needed once domain is added to JSON or website.ts.
