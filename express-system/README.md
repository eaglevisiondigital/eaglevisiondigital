# Eagle Vision Express Intake v1

Production foundation for the Eagle Vision Digital Express Custom Website + App intake and generation system.

## Purpose

Collect enough verified information in a 3–10 minute adaptive intake to generate an Eagle Vision-standard custom website and optional connected app without making the client choose implementation technologies.

## Locked product positioning

- Customer-facing product: **Express Custom Websites** / **Express Website + App**
- AI is a supporting production advantage, not the product name.
- Website target: initial full standard-scope build ready for Eagle Vision review and client preview within **3–24 hours** after required information/assets are accepted.
- App target: initial standard-scope build ready for review/device testing within **3–7 business days** after required information/assets are accepted.
- Apple/Google review and publication time is excluded from the app timing commitment.
- Custom-composed presentation. No cookie-cutter/prebuilt client-facing templates. Reusable engineering, blueprints and modules are allowed behind the scenes.
- Eagle Vision review occurs before client review. Approval is version-specific.

## System principle

`Business need -> capability -> certified implementation -> provider -> configuration`

The intake never asks a normal client to select Appy Pie Code Page, Food Court, BuildFire plugins, or similar implementation details.

## Contents

- `schema/intake.schema.json` – canonical intake data contract
- `config/industry-blueprints.json` – initial Local Service, Church/Ministry, Restaurant blueprints
- `config/capability-catalog.json` – outcome-based capability catalog and current Appy Pie certification state
- `config/conditional-rules.json` – branching, validation and derived-field rules
- `config/express-sla.json` – timing eligibility and scope guardrails
- `src/types.ts` – TypeScript domain types
- `src/qualifyExpress.ts` – Express SLA qualification logic
- `src/buildBrief.ts` – normalized internal generation-brief builder
- `examples/*.json` – representative submissions
- `docs/MASTER-ARCHITECTURE.md` – human-readable build specification
- `docs/EXPRESS-PAGE-SPEC.md` – `/express` website integration and positioning spec

## Next production phase after schema signoff

1. Implement persistence and secure upload storage.
2. Build the five-step adaptive client UI against this schema.
3. Add extraction/prefill from existing websites, PDFs, menus and brand assets.
4. Add internal review console and versioned approval workflow.
5. Connect website generation/deployment pipeline.
6. Run Local Service pilot, then Church, then Restaurant.
7. Certify Appy Pie capabilities before turning them into standard promises.
