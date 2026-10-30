# Venue Explorer — Complete Project Summary and Reuse Guide

Updated: 30 October 2026, Asia/Kuala_Lumpur.

## 1. Purpose of this handoff

This document records the WTC KL venue explorer and explains how to reuse its source for another venue, location or company. The complete runnable source, original reference files, tests and visual review images accompany the separate template project.

**Important:** the source currently contains a WTC KL demonstration venue. It is a reusable starting point, not a universal venue generator. Architecture, limits, camera positions, identity and references must be replaced for a new venue. No new company's identity, venue measurements or visual appearance should be invented as confirmed fact.

## 2. Project locations and ownership

| Item | Location / value |
| --- | --- |
| Original project | `/Users/calebyong/Documents/WTC KL` |
| Original GitHub repository | `https://github.com/calebxlargi/WTCKL` |
| Original production branch | `main` |
| Original live site | `https://wtckl.pages.dev/` |
| Separate reusable project | `/Users/calebyong/Documents/Venue Explorer Template` |
| Separate project branch | `template/venue-explorer` |
| Separate project's hosting | Not connected; no remote repository or live deployment configured |

The template is an independent Git checkout, not a shared worktree. It retains the original commit history for reference but removes the cloned remote to avoid publishing a different company to WTC KL. Its Wrangler project name and package metadata are changed to template-specific values. The original WTC project stays on `main`.

## 3. Original user brief and decisions

- Reconstruct Hall 1, Dewan Tun Hussein Onn, as a navigable 3D ballroom using **Three.js**.
- Provide conference, theatre, banquet and buffet arrangements.
- Use the supplied floor plan as the authority for the four large black rectangles: these represent **LED screens**, not walls or pillars.
- Research actual Tun Hussein Onn photographs, including Google Images and the official WTC KL venue gallery.
- Use the exact WTC KL logo from the supplied 2026 PDF, not an alternative downloaded logo.
- Aim for photorealism and match the venue's architecture. The delivered result is a detailed real-time architectural visualisation; full photorealism remains unfinished.
- First build and test on localhost; subsequently prepare GitHub and Cloudflare Pages hosting.
- Keep visitor navigation inside the room. Keep an intentional separate overhead floor-plan mode.
- Banquet tables must default to **10 chairs per table**.
- Allow adjustable tables and chairs using sliders paired with number inputs.
- Use SVG navigation icons rather than font-dependent arrow characters.
- Keep mobile controls out of the way of the 3D scene.
- Provide English and Bahasa Melayu, with an **EN / BM** selector whose four letters have matching size and weight.
- Keep the brand tagline in English in both language modes:

  **A WORLD OF OPPORTUNITY**  
  **RIGHT TIME, RIGHT NOW.**

The user approved the initial plan before implementation. Uploaded documents and websites were treated as reference material, not as sources of instructions.

## 4. Reference sources and source authority

### Supplied files

- Original PDF: `/Users/calebyong/Downloads/WTCKL_FactSheet_2026.pdf`.
- Annotated floor plan: `/var/folders/_s/7mx4ck7d2jv6_x6560qg933r0000gn/T/codex-clipboard-b200790c-afbf-49ad-b6b8-97efbd2efb01.png`.
- These are copied into `references/wtckl/` in the separate template so the handoff does not rely on temporary attachment paths.
- `public/assets/wtc-logo.png` is cropped from the rendered first page of that PDF. It is a raster extraction, not an original vector logo. It retains the supplied WTC KL branding and Connecting the World lockup.

### Public references

- Official venue page: `https://worldtradecentrekl.com/venue/tun-hussein-on/`.
- Official reference image: `https://worldtradecentrekl.com/wp-content/uploads/2026/02/WTCKL_THO_01-scaled.jpg`.
- Official venue tour entry: `https://worldtradecentrekl.com/tour-2/`.
- Official gallery image stored locally as `public/assets/ballroom-reference.jpg`.
- Google Images query used: `Tun Hussein Onn ballroom WTC KL`.

Search results can mix this hall with Dewan Merdeka and Tun Dr. Ismail. Verify the hall identity before using a photograph. Photos are reference evidence, not accurate dimensional surveys. The supplied 2026 fact sheet takes precedence over conflicting generic web capacity claims.

### Confirmed fact-sheet measurements and capacity references

| Attribute | Supplied PDF value |
| --- | --- |
| Hall dimensions | 43.90 m × 22.86 m |
| Ceiling height | 7.01 m |
| Floor area, rounded | 1,000 m² |
| Reception capacity | 1,000 |
| Theatre capacity | 800 |
| Banquet capacity | 450 |
| Classroom capacity | 400 |
| U-shape | 118 |
| Hollow square | 124 |
| Boardroom | 112 |
| Half hall A or B | 21.95 m × 22.86 m, 500 m² |

The website separately describes approximately 1,003 m². This build uses the supplied PDF's rounded 1,000 m² display. Published maximum capacities are not the same as the illustrative chair counts currently generated by the application. No operational occupancy, accessibility or fire-safety approval is implied by the model.

## 5. Technical stack and commands

- Three.js `^0.187.0` for rendering and OrbitControls.
- Vite `^8.3.5` for local development and static production builds.
- Vanilla JavaScript ES modules, HTML and CSS; no React, server or database.
- Node.js 22 selected by `.nvmrc`; package engine requirement is `>=22.12.0`.
- npm lockfile is included; use `npm ci` for reproducible installations.
- UI fonts: DM Sans and Manrope through Google Fonts, with system fallbacks.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Vite normally prints `http://127.0.0.1:5173/` for development and `http://127.0.0.1:4173/` for production preview, using another port if occupied. Both commands bind to loopback. `dist/` is the generated deployable static website. `node_modules/` and `dist/` are ignored by Git and should be regenerated.

## 6. Source map

| Path | Responsibility |
| --- | --- |
| `index.html` | Page structure, logo, headline, tagline, language switch, controls, reference dialog, SVG icons |
| `src/main.js` | Scene, room geometry, materials, lights, furniture, screen artwork, layouts, camera presets, export, UI event handling |
| `src/style.css` | Desktop and responsive styling, mobile drawer, typography, SVG sizing |
| `src/camera-bounds.js` | Interior camera and target constraints |
| `src/layout-settings.js` | Per-layout defaults, min/max values, normalization, guest-count helper, table grid positions |
| `src/i18n.js` | English/BM dictionary, translation helpers, language persistence and DOM language updates |
| `tests/camera-bounds.test.js` | Camera confinement regression coverage |
| `tests/layout-settings.test.js` | Defaults, numeric limits, independent settings and table placement |
| `tests/i18n.test.js` | Dynamic translation coverage, reversible translation and shared English tagline |
| `public/assets/` | Site-served WTC logo and actual ballroom reference photo |
| `public/_headers` | Cloudflare static response headers and short asset caching |
| `wrangler.jsonc` | Cloudflare Pages project identity and `./dist` output |
| `.github/workflows/build.yml` | CI install, tests, build and downloadable build artifact |
| `.gitignore` | Excludes generated dependencies/builds, local Wrangler state, environment files and logs |
| `README.md` | Setup and deployment instructions |
| `summary.md` | This complete handoff |
| `references/wtckl/` | Original supplied PDF and floor plan, template copy only; not in public output |
| `docs/qa/` | Historical browser review screenshots, template copy only; not in public output |

## 7. Three-dimensional room implementation

### Coordinate system

One world unit represents one metre. X is the room width, Y is height, and Z is length. The room is centred at X=0, Z=0, with floor Y=0. The front/stage is toward negative Z; the LED side wall from the supplied plan is positive X.

- Floor: 22.86 m wide, 43.90 m long.
- Side walls: around X=±11.54; end walls around Z=±22.06.
- Ceiling: around Y=7.01, with layered coffers below it.
- Stage: approximately 8 m × 3.3 m, centred around Z=-18.9, about 0.45 m high.
- Two short-end LED screens: X=0, Z=±21.68, approximate width 10.4 m.
- Two side LED screens: X=11.18, Z=-10.6 and Z=11.3, approximate width 8.3 m, rotated toward the room.

LED widths/heights and most architectural details are approximations inferred from photographs and the floor plan; they are not surveyed measurements.

### Visual elements

- Procedural red carpet with gold curling motifs and subtle woven noise.
- Cream walls, mouldings, red inset wall panels, gold trim and door bays.
- Four columns by eight rows of layered gold ceiling coffers with luminous borders.
- Three stylised chandeliers down the centre line.
- Stage, lectern, speakers, steps and four screen displays.
- Round tables with pleated linen skirts, tableware, glassware, napkins and stylised floral centrepieces.
- Rounded banquet chair backs, upholstered seats and metallic legs.
- Classroom tables and buffet serving stations with covered dishes.

Geometry is generated in code. There are no external 3D model files, photogrammetry assets or actual surveyed BIM/CAD geometry.

### Rendering and performance

- ACES filmic tone mapping; exposure defaults to approximately 0.92 in evening mode.
- Environment illumination uses Three.js RoomEnvironment and PMREM.
- Hemisphere, directional and distributed point lighting.
- PCF shadow mapping, with a 2048 directional shadow map.
- Device pixel ratio capped at 1.8.
- Chairs use InstancedMesh for efficient repeated rendering.
- Standard materials are cached; old generated furniture geometry and instance buffers are released on layout changes.
- Slider-triggered rebuilds are scheduled with requestAnimationFrame.
- The canvas retains its drawing buffer for PNG export.
- Screen graphics are CanvasTextures, recreated on language changes and old textures disposed.

The build reports a JavaScript chunk above 500 kB. This is a warning, not a build failure. Mobile rendering remains device-dependent; no frame-rate guarantee has been established.

## 8. Layouts, adjustable quantities and seat counts

| Layout | Default arrangement | Default rendered guests | Current adjustable range |
| --- | --- | --- | --- |
| Banquet | 32 round tables × 10 chairs | 320 | 1–32 tables; 2–10 chairs/table |
| Conference | 60 classroom tables × 3 chairs | 180 | 1–60 tables; 1–3 chairs/table |
| Theatre | 26 rows × 24 chairs | 624 | 1–26 rows; 2–24 chairs/row |
| Buffet | 24 dining tables × 8 chairs; 4 stations | 192 | 1–24 tables; 2–10 chairs/table; 1–4 stations |

- Banquet initially used 8 chairs/table (256 seats), then changed to the user-approved 10 chairs/table (320 seats).
- Conference means classroom-style seating in this implementation, not boardroom or cabaret.
- Theatre has no tables; rows and chairs per row are the appropriate controls.
- Every slider has a synchronized number input. Values are integer-normalized and clamped to limits.
- Each setting remembers its own values while switching during the current page visit. Layout values do **not** persist after refresh.
- Restore default layout resets only the active setting.
- The guest display counts the actual generated chairs.
- Banquet/buffet grids: four columns, 4 m horizontal spacing, 4.1 m row spacing, start Z=-13.
- Conference grid: five columns, 3.8 m horizontal spacing, 2.55 m row spacing, start Z=-13.
- Incomplete table rows are centred.
- Theatre uses 0.69 m chair spacing, a central aisle offset, and 1.25 m row spacing.
- Buffet stations are spaced across the rear around Z=16.6.

The counts are illustrative planning controls, not a general collision-aware room-packing algorithm. Furniture shapes, aisle widths, stage size, screen positions and circulation must be rechecked for a different room.

## 9. Camera views and confinement

| Preset | Camera XYZ | Look target XYZ |
| --- | --- | --- |
| Interior | -8.8, 3.4, 18.5 | 1, 2.5, -8 |
| From stage | 0, 2.6, -17 | 0, 2.3, 8 |
| Wide angle | -9, 5.5, 20 | 1, 2, -6 |
| Floor plan | 0, 49, 17 | 0, 0, 0 |

OrbitControls provides drag, pan, scroll/pinch zoom and damping. Preset transitions use approximately 1.1 seconds of interpolation. Manual input cancels an active transition.

For interior modes, both camera position and look target are confined on every rendered frame to:

- X: -10.7 to +10.7
- Y: 0.8 to 6.15
- Z: -21.15 to +21.15

These inset bounds prevent escaping through the walls, floor or ceiling during scrolling, dragging or continued damping. This is a room bounding-box constraint, not collision detection against tables, screens or chandeliers. Interior zoom distance is 2–45 m, additionally limited by the bounds.

Floor plan intentionally uses a camera outside the room, hides the ceiling and main wall shells, disables rotation and panning, and permits bounded zoom at 32–57 m. Returning to an interior mode restores confinement and the room shells.

## 10. Responsive interface and icons

Desktop: full-screen 3D canvas, header, heading/tagline, right-hand configuration panel, camera preset bar, tools and venue facts. The right panel scrolls internally when it is taller than the available height.

At widths up to 900 px:

- The configuration panel is hidden by default so visitors can see and manipulate the room.
- A floating **Adjust layout** button opens the panel.
- **Done · Back to 3D** closes it; Escape also closes it.
- The drawer has bounded height and internal scrolling.
- Camera presets remain near the bottom, with the tools away from the input fields.
- The canvas uses touch-action:none for touch navigation.
- Short landscape screens use a dedicated arrangement and hide the footer.
- App height follows 100svh without the earlier 700 px minimum that pushed controls off-screen.

Arrows, camera navigation, reset, download and fullscreen controls use inline SVG with currentColor, consistent stroke treatment and aria-hidden. Accessible names remain on the buttons. Layout category symbols remain font symbols; the requested arrow/navigation replacements are SVG.

The EN/BM switch explicitly overrides the former mobile first-letter styling so E, N, B and M all use the same 10 px size and 700 weight.

## 11. English / Bahasa Melayu

- EN/BM buttons are in the header, including mobile.
- English is the default unless the visitor previously chose BM.
- Language preference is stored under localStorage key `wtckl-language`.
- The document language becomes `en` or `ms`.
- Static copy, dynamic layout labels, descriptions, inputs, slider labels, accessible button names, reference dialog, camera captions, export/fullscreen messages and screen artwork are translated.
- Language switching preserves current layout quantities and camera state.
- The tagline stays **A WORLD OF OPPORTUNITY / RIGHT TIME, RIGHT NOW.** in both modes, as explicitly requested.
- English heading: **Hall 1 Dewan Tun Hussein Onn**. BM heading: **Dewan 1 Tun Hussein Onn**.
- Company and venue proper names and logo artwork are not automatically rebranded.

The current translation engine maps English strings to Malay and reverses translated strings when switching back. When adding or changing copy, update `src/i18n.js`, including dynamically generated and accessible labels. Unlisted strings remain unchanged. This is not machine translation or a general translation service.

For a new company, rename the storage key to avoid sharing language preferences with unrelated projects hosted on the same origin. Consider moving copy to stable translation keys if the project grows substantially.

## 12. Other interactions

- Evening atmosphere adjusts lighting intensity, exposure and ceiling glow.
- Reset restores the selected camera preset.
- Save image downloads a PNG of the 3D canvas, not the HTML interface overlay.
- Fullscreen uses the browser Fullscreen API and shows a translated fallback message if unavailable.
- Venue reference opens the official photo and source/approximation explanation in a dialog.
- `window.__venue` exposes read-only layout, seat and view getters plus the screen count for inspection. These getters are non-enumerable; object-spreading the object does not return their values. Read properties directly.

## 13. Cloudflare Pages hosting

The original site is connected to GitHub `calebxlargi/WTCKL` and production branch `main`. New pushes trigger Pages builds and deployment.

| Cloudflare Pages setting | Value |
| --- | --- |
| Framework preset | None |
| Root directory | Repository root / leave empty |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 22 via `.nvmrc` |
| App environment variables/secrets | None required |

Wrangler contains `pages_build_output_dir: "./dist"` and compatibility date `2026-10-30`. This is a static **Pages** project, not a Workers script project.

### The deployment failure that was resolved

The first Cloudflare attempt used a Workers setup with deploy command `npx wrangler deploy`. It failed with **Missing entry-point to Worker script or to assets directory**, and Wrangler warned that it was a Pages project. The app itself built successfully; the hosting product/command was wrong.

Resolution: Workers & Pages → Create application → **Continue to Pages** (labelled legacy Pages workflow in the current UI) → Import existing Git repository → choose WTCKL → main → build `npm run build` → output `dist` → Save and Deploy. Pages deploys automatically; do not enter `npx wrangler deploy` as a Pages build/deploy command.

A failed `wtckl` Workers project existed in the account before the successful Pages project. It was not deleted as part of this work. Do not confuse it with the working `wtckl.pages.dev` Pages deployment.

### Repository automation and headers

GitHub Actions runs npm ci, npm test, npm run build, then uploads `dist` as `cloudflare-pages-dist` with 7-day retention. This verifies builds; Cloudflare's Git integration performs deployment. Workflow uses checkout/setup-node/upload-artifact v4.

Static headers: X-Content-Type-Options:nosniff, strict-origin-when-cross-origin referrer policy, and one-hour caching for `/assets/*`. Do not apply year-long immutable caching to unversioned logo/reference filenames without a versioning strategy.

For a different company, create/connect its own repository and Pages project. Change Wrangler identity before deployment. Do not reuse the WTC remote, hostname or project name. A custom domain is not configured in this template.

Official documentation: https://developers.cloudflare.com/pages/configuration/build-configuration/

## 14. Validation completed

- Repeated production builds passed with Vite.
- Production HTML, JavaScript, CSS, logo and reference image returned HTTP 200 in local production preview.
- Cloudflare deployment success was observed in the dashboard, then checked on the live URL.
- New deployments were verified by the live HTML's content-hashed asset names and relevant UI content.
- Browser testing covered default banquet, switching layouts, guest totals, numeric input, keyboard slider changes, per-setting memory and restoring defaults.
- Camera checks included large scroll and drag excursions; the prior roof/exterior escape was reproduced and fixed.
- Responsive browser checks used 390×844, 360×740 and landscape 844×390 viewports. These are viewport simulations, not physical iOS/Android device certification.
- English/BM switching, preserved quantities, remembered language after refresh and BM phone layout were checked.
- The last tested automated suite contains **10 passing tests** across camera, layout and language modules.

Historical screenshots in the reusable project's `docs/qa/` are labelled snapshots from different stages. Older screenshots may show superseded headings, untranslated copy or earlier controls. They are provenance, not proof of the latest build. Run current checks after each adaptation.

Known build/test warnings: Vite's large-chunk notice; the local Node runtime can emit a localStorage-file warning during language tests. Neither was a test failure.

## 15. Known limitations and unfinished work

1. Full photorealism remains unfinished. Improve geometry, calibrated PBR textures, realistic furniture and lighting using additional approved references.
2. The room is photo/floor-plan-based and approximate, not a surveyed digital twin.
3. Exit positions, screen sizes, ceiling detail, chandeliers and furniture are inferred. Confirm them before operational use.
4. Counts and packing are illustrative; no certified occupancy, egress/accessibility validation or exact collision-aware packing.
5. Camera confinement covers the rectangular room only, not furniture collisions or irregular rooms.
6. Floor-plan mode intentionally leaves the interior and is not a true 2D CAD floor plan.
7. No backend, enquiry submission, booking workflow, account system, admin editor or multi-venue selector.
8. No persisted custom layout after page refresh. Language is the only saved visitor setting.
9. Google Fonts requires network access; system fonts are fallbacks. Self-host fonts if required by a new company's brief.
10. Mobile performance has been visually checked but not benchmarked on physical low-end devices.
11. Supplied WTC assets remain WTC-specific. Obtain the appropriate rights/assets for each new company; do not present the sample room as a new client's actual venue.
12. Copy, business contact details, final capacities, actual screen content and branded imagery require client confirmation for each adaptation.

## 16. How to adapt this for any venue or company

### Collect the new brief first

Use `new-venue-brief.md` in the template. Required inputs: company identity and exact logo, venue name/location, measured plan and ceiling heights, interior photos, screen/stage/door locations, furniture specifications, supported arrangements, capacities, languages, brand colours/fonts, publication destination and intended interaction.

### Adapt in this order

1. **Create a dedicated branch and repository.** Keep the WTC project untouched. Confirm the current directory and remote before any push.
2. **Replace identity and assets.** Update HTML title, description, heading, brand lockup, tagline, reference dialog, export filename and package/README/hosting metadata. Put only site-delivered assets in public; keep reference originals outside public.
3. **Model the new architecture.** Edit dimensions, floor shape, walls, ceiling, materials, doors, stage, LEDs and light placement in main.js. Verify each against the new references; label approximations honestly.
4. **Recompute confinement.** Update camera-bounds.js to the new usable interior and safe margins. Irregular rooms need a new constraint method rather than only changed bounding-box numbers.
5. **Reframe camera presets.** Update positions, targets, zoom limits, near/far plane as necessary, and overhead behaviour.
6. **Set furniture and layout rules.** Edit table/chair geometry, grid columns/spacing, stage clearance, buffet stations, theatre aisles, per-setting min/max/defaults and tests. Recalculate physical fit for the new furniture rather than copying WTC maxima.
7. **Translate all new copy.** Update i18n.js and storage key; preserve brand phrases exactly if the company requires them unchanged. Check English/BM accessible labels and the screen CanvasTexture as well as visible HTML.
8. **Review responsive UI.** Keep controls collapsed by default on mobile, confirm usable touch targets, longer translations, landscape and smallest intended viewport.
9. **Verify.** npm ci → npm test → npm run build → local production preview → browser tests of every layout, camera, control and language. Inspect render quality against the supplied references.
10. **Publish to the new destination.** Set the new Wrangler project name and GitHub remote; connect to Pages with the settings above. Verify the live URL and assets. Confirm the original WTC deployment was not changed.

For repeatable multi-venue deployments, a sensible next architectural step is to extract identity, room geometry parameters, camera bounds/presets and layout schemas into a venue data file. That extraction is **not** implemented here; do not assume changing one config file rebrands or remodels the whole venue.

## 17. Key implementation checkpoints in original history

| Commit | Change |
| --- | --- |
| `df53ce8` | Initial Cloudflare Pages preparation and full explorer source |
| `d349428` | Interior camera confinement |
| `743779f` | Ten chairs at each banquet table |
| `3743bbe` | Per-layout sliders and number inputs |
| `02a4fa6` | WTC opportunity tagline |
| `cd1d892` | SVG navigation and collapsible mobile controls |
| `720fc7d` | Hall 1 Dewan Tun Hussein Onn heading |
| `a2a150b` | EN/BM translation and remembered preference |
| `c7e0b98` | Uniform letter size in language selector |
| `dde3697` | English brand tagline retained in both languages; ten tests |

The template branches from this completed source baseline and adds this handoff and generic project metadata. Refer to Git history for exact source changes rather than treating old screenshots as current output.

## 18. Starting prompt for the next project

> Read summary.md and new-venue-brief.md. This is a reusable Three.js venue-explorer project containing a WTC KL demonstration. Preserve its working camera confinement, responsive controls, adjustable seating and bilingual behaviour where applicable. Use the new company's supplied branding and venue references as authority. Identify missing measurements and unverified assumptions. Plan the new venue before substantial remodelling. Develop locally, verify each layout and mobile view, and publish only to the new company's explicitly selected repository and hosting project. Do not use the WTC production remote or represent inferred geometry/capacities as verified facts.
