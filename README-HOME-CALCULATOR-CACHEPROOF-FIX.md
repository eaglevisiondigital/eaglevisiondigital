# Homepage Calculator Cache-Proof Fix

This patch addresses the live screenshot where the two main calculator headlines
and blue CTA button text were still rendering dark.

## Fixes
- Both calculator headlines are explicitly locked to white with dedicated HTML classes.
- Blue CTA button text is explicitly locked to white.
- Secondary calculator copy is brightened for dark-card readability.
- Desktop calculator cards use matched geometry so the headline, slider, results,
  lower-information, and CTA bands line up across both columns.
- Mobile/tablet retains natural stacked content height.

## Files changed
- `index.html`
- `css/main.css`
