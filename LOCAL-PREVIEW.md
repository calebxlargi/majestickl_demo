# Majestic Ballroom local preview

The active application now depicts the Majestic Ballroom in Kuala Lumpur. The historical WTC handoff in summary.md remains a record of the original template.

Run `npm run dev` and open the Local URL printed by Vite. This session uses http://127.0.0.1:5174/ because port 5173 was occupied.

Selected Marriott measurements: length 35.9 m, width 42.5 m, ceiling 6 m; floor area 1,525.75 m². One scene unit is one metre. X is width, Z is length. Published capacities: 1,250 banquet, 1,500 theatre, 1,150 classroom. The generated furniture counts are illustrative and separately labelled.

The model replaces WTC room geometry with a wider, shallower room, cream coffers, dark marble wall piers, gold door panels, purple patterned carpet, a chandelier grid and a single broad front screen. Stage, doors, chandelier positions and screen size are inferred from photographs; no verified architectural plan was available. Identity is typeset text, not an extracted hotel logo.

Official reference photograph: public/assets/majestic-theatre.webp, downloaded from the Marriott events page. Additional sources and measurement selection: references/majestic-kl/research.md.

Verified: ten automated tests and production build pass; browser checks cover all four layouts, input-driven seat totals, overhead/interior views, English/Bahasa Melayu, the reference dialog and the mobile layout drawer at 390 × 844. Arrow icons use inline SVG. A desktop review image is retained at docs/qa/majestic/localhost-desktop.png.

This is local-only work. No hosting or repository publication was performed.
