# Vishal Rawat — VAPT & SOC Portfolio

Next.js + TypeScript + Tailwind personal site built around a real-time,
GPU-rendered dithering effect — applied to video and to real photos.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What changed in this iteration

- **New hero video** (`public/videos/hero.mp4`).
- **Real photos placed by subject**: the AD word-cloud photo, the web
  app security photo, and the SOC photo are now the dithered visual for
  their matching case study card (AD Exploitation / Web Application
  Security / SOC & SOAR) via `DitherImage`, instead of a generic
  generative pattern. `ProjectCard.tsx` → `content.ts`'s `projects[].image`.
- **Scrolling fixes**:
  - Anchor-nav no longer lands sections under the fixed header —
    `section[id] { scroll-margin-top: 88px }` in `globals.css`.
  - `overflow-x: hidden` on `html`/`body` to stop any horizontal-scroll
    leakage (marquee width, oversized hero type on narrow screens).
- **"SOC & Detection Engineering" → "SOC & SOAR"**: title and
  description now stick to SOC/SOAR terminology only.
- **Skills expanded with real HTB CDSA curriculum topics** — added
  *Incident Handling (DFIR)* and *Windows Event Log Forensics*
  (Sysmon/ETW-based threat hunting), pulled from the actual HTB CDSA
  module list (Incident Handling Process; Security Monitoring & SIEM
  Fundamentals; Windows Event Logs & Finding Evil).
- **Tools trimmed** to the 8 that actually matter day to day: Nmap,
  Burp Suite, SQLmap, Wireshark, BloodHound, Mimikatz, Splunk, Kali
  Linux — cut FFUF, Nuclei, Responder, Nessus, TheHive, Python, Bash.
- **Blood effect redesigned**: `.blood-drop` in `globals.css` is now an
  actual teardrop (`clip-path`, gradient fill, glossy highlight, soft
  red glow) instead of a straight bar — and there are only three,
  staggered on a slow 6s cycle, so it reads as a deliberate accent
  rather than a constant animation.
- **Heading wording**: tagline is now "VAPT AND SOC GUY" (spelled out,
  not "&"), shown larger/bolder above the name as a proper sub-heading,
  and kept identical in both languages — like a name, a personal title
  isn't something you translate.
- **Full bilingual coverage** (the "things aren't actually switching to
  German" issue): project titles/descriptions, skill names, AD-surface
  category names and every bullet item, and tool categories are now
  genuinely bilingual (`Bi = { en, de }` in `content.ts`, resolved with
  `L(field, lang)`), not just the section headings. Tool names,
  certification titles, and tag chips (e.g. "Nmap", "CEHv13") stay in
  English by design — that's normal for technical/proper nouns, the
  same way you wouldn't translate a brand name.
- **Nav cleaned up**: dropped the `mix-blend-difference` trick (looked
  glitchy over varying content) for a simple `backdrop-blur` bar —
  more professional, and removes a source of visual inconsistency
  while scrolling.

## How the dither effect works

- `src/components/DitherShader.ts` — framework-free WebGL renderer,
  shared by every dithered surface on the site.
  - `sourceMode: "video"` uploads a video frame every tick (Hero only).
  - `sourceMode: "image"` uploads a static photo once (About, Skills,
    and now all three project cards).
  - `sourceMode: "generative"` skips media entirely, driving the same
    pipeline off a seeded fbm noise field (kept as `DitherField.tsx`
    for future use, currently unused now that all cards have photos).
- The renderer sets `gl.pixelStorei(UNPACK_FLIP_Y_WEBGL, true)` once at
  context creation — this is what keeps every video/photo right-side up.
- `src/lib/ditherConfig.ts` — single source of truth for dot size,
  contrast, color, algorithm, seed, flow, mouse strength and resolution
  scale, with responsive tablet/mobile overrides.

## Content & language

- `src/lib/content.ts` — structured content. Prose fields that should
  read naturally in German use `Bi = { en: string; de: string }`;
  resolve with `L(field, lang)`. Proper nouns (tool names, cert titles,
  tag chips) stay as plain strings.
- `src/lib/i18n.ts` + `LanguageContext.tsx` — headings/labels for
  sections that aren't data-driven (nav, hero description, section
  tags/titles, terminal hint, contact copy). Default language is
  German; toggle via the DE/EN control in the nav.

## Performance notes

- Single `<canvas>` per instance — never one DOM node per dot.
- Rendering pauses via the Page Visibility API when the tab is hidden.
- Images upload to the GPU exactly once; only the Hero video re-uploads
  every frame.
- `resolutionScale` + larger `dotSize` on tablet/mobile cut GPU cost
  substantially on weaker devices while keeping the visual identity.
