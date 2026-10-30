# Majestic KL Ballroom Explorer

Interactive Three.js preview of the Majestic Ballroom, The Majestic Hotel Kuala Lumpur. Four seating layouts, adjustable guest counts, interior camera navigation, overhead view, EN/BM interface and SVG navigation icons.

## Development

Use Node.js 22. Run `npm ci`, then `npm run dev`. Open the URL printed by Vite.

Validation: `npm test` and `npm run build`. Static output is `dist/`.

## Cloudflare Pages

- Repository: `calebxlargi/majestickl_demo`
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: repository root
- Node version: 22 (see `.nvmrc`)
- No environment variables or database required.

Use Cloudflare Pages Git integration for automatic deployments on push.

## Measurements and references

Marriott metric chart: 35.9 m length × 42.5 m width × 6 m ceiling; area 1,525.75 m². Published capacities: 1,250 banquet, 1,500 theatre and 1,150 classroom. Generated seating counts are illustrative and displayed separately.

Architecture follows official photographs. Stage, doors, chandeliers and screen dimensions/positions are approximate; an official architectural floor plan has not been verified. The header uses typeset hotel identity rather than a supplied official logo.

See [research notes](references/majestic-kl/research.md) and [local preview notes](LOCAL-PREVIEW.md). `summary.md` and `references/wtckl/` retain the original template history.
