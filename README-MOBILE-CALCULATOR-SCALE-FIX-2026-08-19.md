# Eagle Vision Digital — Mobile Calculator Scale Fix

This mobile-only correction fixes both homepage payment calculators.

The visible scale labels now sit horizontally beneath the slider and are positioned to match the actual nonlinear slider mapping:

- $3K = 0%
- $25K = 34%
- $100K = 72%
- $1M = 100%

This preserves the intentionally expanded $3K–$100K slider resolution while keeping the upper range compressed toward $1M.

Desktop and tablet behavior is unchanged.

Changed file:
- css/main.css
