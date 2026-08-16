# Eagle Vision Digital — Payments Savings Calculator System

Locked implementation standard for the Eagle Vision ecosystem.

## Shared volume slider
Milestones: $3,000, $5,000, $10,000, $25,000, $40,000, $60,000, $100,000, $200,000, $500,000, $1,000,000 monthly processing volume.

The slider is intentionally nonlinear. Most physical travel is allocated to $3K–$100K, with $100K–$1M compressed toward the upper end.

## Calculator 1 — Processing Savings
- Estimated fees: up to 4% of selected monthly volume.
- Potential monthly savings: up to 99% of estimated fees.
- Potential annual savings: monthly savings × 12.
- Results are illustrative estimates, not guaranteed rates or savings.

## Calculator 2 — Digital + Payments Advantage
- Under $10,000/month: $250 upfront + $10/month.
- $10,000–$19,999/month: $500 upfront + $25/month.
- $20,000–$39,999/month: $1,000 upfront + $50/month.
- $40,000–$74,999/month: $1,500 upfront + $75/month.
- $75,000–$100,000/month: $2,000 upfront + $100/month.
- Over $100,000/month: custom quote.
- First-year technology savings = upfront discount + monthly discount × 12.

## Handoff behavior
Homepage CTA links include `?volume=<selected volume>` and calculator identity, then open the corresponding expanded calculator anchor. The destination initializes from the selected volume.

## Brand rule
The calculation logic, milestones, $1M ceiling, discount tiers, first-year formula and selected-volume handoff are the permanent shared Eagle Vision ecosystem standard. Each website may present the system with its own brand styling and audience-specific messaging.
