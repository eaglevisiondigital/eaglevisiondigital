# Eagle Vision Capital Systems — V44 Update Fixes

This package contains the approved fixes since V43.

## Included changes

1. **Hard external-link rule site-wide**
   - Every absolute external website link (`http://` or `https://`) now opens in a new browser tab/window using `target="_blank"`.
   - `rel="noopener noreferrer"` is applied for security.
   - This keeps `eaglevision.biz` open while visitors explore Eagle Vision Digital, Propel, Dave Fowler Voice, Outpost, and other external destinations.

2. **Global header/home behavior preserved across every included page**
   - The Eagle Vision logo links to the homepage/top.
   - On the homepage it returns to `#top`.
   - On internal pages it returns to `index.html#top`.

3. **Propel homepage section — approved V44 refinement**
   - Existing approved copy and green section design remain intact.
   - The approved ecosystem visual is enlarged approximately 28–30% on desktop.
   - Visual positioning is shifted right/up to better match the approved mockup composition.
   - The small text-built Propel mark is replaced by the approved Propel by Eagle Vision logo asset.
   - The Propel logo is positioned near the lower-right corner and substantially enlarged to visually balance the Discover Propel CTA at lower-left.
   - Mobile/tablet rules remove the desktop scale transform to avoid distortion or overflow.

## Files to merge

Replace the matching HTML files from V43 with the files in this package and add:

`assets/propel-by-eagle-vision-approved-transparent-trim.png`

Do not remove the existing production `styles.css`, `script.js`, or other assets from the repository.
