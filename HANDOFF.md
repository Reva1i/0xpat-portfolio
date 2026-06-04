# 0xpat Portfolio — Handoff Document

**Last updated:** 2026-06-04  
**Stack:** React 18 + Vite + Tailwind CSS + Framer Motion  
**Live URL:** https://0xpat.github.io/0xpat-portfolio (configured, not yet deployed)

---

## Section Order (App.jsx)

Rendered top to bottom:

1. `<ScrollProgress />` — fixed top progress bar
2. `<Nav />` — fixed header with blur backdrop
3. `<Hero />` — DEX swap widget easter egg
4. `<StatsBar />` — 4 key metrics strip with count-up
5. `<Liquidity />` — deal flow table (grouped by year, collapsible)
6. `<Partnerships />` — 3 institutional deal cards
7. `<Launchpad />` — IDO record + Titan Launch highlight
8. `<Farms />` — Base growth chart + profitability callout
9. `<About />` — bio + social links + Connect CTA

> **Note:** `Yield.jsx` exists but is **not rendered** in App.jsx. It was replaced by Partnerships during development. The component is fully built — see Pending section.

---

## All Component Files

### React Bits components (exact copies from local `.md` files)

| File | Source `.md` | Active? |
|------|-------------|---------|
| `src/components/BorderGlow.jsx` | `react-bits/BorderGlow.md` | Yes — used across all card surfaces |
| `src/components/BorderGlow.css` | `react-bits/BorderGlow.md` | Yes |
| `src/components/ShinyText.jsx` | `react-bits/ShinyText.md` | CSS only — `.shiny-text` class applied in Nav via GlitchText |
| `src/components/ShinyText.css` | `react-bits/ShinyText.md` | Yes — imported in Nav.jsx |
| `src/components/GradientText.jsx` | `react-bits/GradientText.md` | Yes — stat values, section headers, profitability numbers |
| `src/components/GradientText.css` | `react-bits/GradientText.md` | Yes |
| `src/components/RotatingText.jsx` | `react-bits/RotatingText.md` | **No — replaced by TextType. Dead code.** |
| `src/components/RotatingText.css` | `react-bits/RotatingText.md` | **No — dead code.** |
| `src/components/TextType.jsx` | `react-bits/TextType.md` | Yes — Hero typing descriptor |
| `src/components/TextType.css` | `react-bits/TextType.md` | Yes |
| `src/components/Folder.jsx` | `react-bits/Folder.md` | **No — on disk, never integrated.** |
| `src/components/Folder.css` | `react-bits/Folder.md` | **No — on disk, never integrated.** |

### Site components

| File | Status | Notes |
|------|--------|-------|
| `src/components/Nav.jsx` | Done | GlitchText + ShinyText.css for brand; Telegram Connect button |
| `src/components/Hero.jsx` | Done | Swap widget, TextType descriptor, contact icons post-swap |
| `src/components/StatsBar.jsx` | Done | GradientText wraps CountUp for each stat |
| `src/components/Liquidity.jsx` | Done | Year-group accordion, DEGEN hover tooltip |
| `src/components/Partnerships.jsx` | Done | BorderGlow on all 3 cards |
| `src/components/Launchpad.jsx` | Done | IDO logo marquee strip, RankingCard, Titan Launch highlight |
| `src/components/Farms.jsx` | Done | Recharts dual-axis chart, profitability GradientText numbers |
| `src/components/About.jsx` | Done | Social icon row, Connect CTA (→ Telegram) |
| `src/components/Yield.jsx` | **Orphaned** | Fully built, not in App.jsx — see Pending |
| `src/components/GlitchText.jsx` | Done | Used only in Nav for `0xpat / doxie` |
| `src/components/GlitchText.css` | Done | |
| `src/components/BlurText.jsx` | Done | Used for intro paragraphs in Liquidity, Launchpad, Farms, About |
| `src/components/SplitText.jsx` | Done | Used in Hero eyebrow line |
| `src/components/CountUp.jsx` | Done | Scroll-triggered number animation, used in StatsBar |
| `src/components/ScrollProgress.jsx` | Done | Fixed purple progress bar at top |
| `src/components/Magnet.jsx` | **Not integrated** | On disk — see Decisions |

---

## React Bits Integration Map

### BorderGlow
Magnetic edge-glow card wrapper. Standard props used everywhere:
```jsx
backgroundColor="#111111"
colors={['#7c3aed', '#40D6E1', '#6d28d9']}
glowColor="270 70 60"
borderRadius={12}
```

| Location | Applied to | Extra props |
|----------|-----------|-------------|
| `Hero.jsx` | Swap widget card | `borderRadius={16}` |
| `Liquidity.jsx` | Deal table outer container | — |
| `Partnerships.jsx` | All 3 deal cards | `glowIntensity={0.8}` |
| `Launchpad.jsx` | Titan Launch highlight card | — |
| `Yield.jsx` | Partner cards + stat cards | (not rendered) |
| `Farms.jsx` | Chart card, Strategy callout, Profitability callout | — |

**Not wrapped:** Launchpad's 3 bottom stat cards (`30+`, `~$1M`, `Zero Errors`) — plain `div` with static border.

### GradientText
Animated shimmer gradient via `motion/react`. Renders as `motion.div` — **cannot go inside `<p>` tags** (use `<div>` instead).

**Section headers** — applied to `<h2>` in Liquidity, Launchpad, Farms, About:
```jsx
<GradientText colors={['#ffffff', '#a78bfa', '#ffffff']} animationSpeed={8} yoyo={true}>
```

**Stat values** — all 4 metrics in StatsBar, wraps `CountUp` inside:
```jsx
<GradientText colors={['#ffffff', '#7c3aed', '#40D6E1', '#ffffff']} animationSpeed={6} pauseOnHover={true} className="font-mono text-xl font-semibold">
```

**Profitability numbers** in `Farms.jsx` ProfitabilityCallout:
```jsx
<GradientText colors={['#ef4444', '#f97316', '#ef4444']} animationSpeed={3}>–214,460</GradientText>
<GradientText colors={['#22c55e', '#40D6E1', '#22c55e']} animationSpeed={3}>+26,146</GradientText>
```

**Not applied:** Partnerships section header — still plain `text-white`. Add GradientText there if visual consistency is needed.

### TextType
GSAP typewriter in `Hero.jsx` below the bio. Container: `color: '#7c3aed'`, `font-mono text-sm`:
```jsx
<TextType
  text={['Liquidity deals.', 'Incentive design.', 'Ecosystem partnerships.', 'Protocol growth.']}
  typingSpeed={40}
  deletingSpeed={20}
  pauseDuration={1800}
  showCursor={true}
  cursorCharacter="_"
  cursorClassName="text-purple-400"
/>
```

### ShinyText
**Only applied via CSS class in Nav.jsx.** The `ShinyText` JSX component is never instantiated. Instead, `Nav.jsx` does:
```jsx
import './ShinyText.css'
// ...
<GlitchText className="shiny-text">0xpat / doxie</GlitchText>
```
The `.shiny-text` CSS class from ShinyText.css provides the shimmer on top of the glitch effect.

### RotatingText
Was applied in Hero.jsx in a prior session. **Replaced by TextType** — `RotatingText.jsx` and `RotatingText.css` are dead code. Safe to delete.

### BlurText
Standard usage across intro paragraphs — always `delay={60} direction="bottom"`. Used in Liquidity, Launchpad, Farms, About.

---

## Pending / Incomplete

### Phase 3D — Lanyard (not started)
Planned for the About section as a visual identity element (physics-simulated ID card on a string).

Steps to implement:
1. Read `react-bits/Lanyard.md`
2. Install 3D dependencies:
   ```bash
   npm install three meshline @react-three/fiber @react-three/drei @react-three/rapier
   ```
3. Add to `vite.config.js`:
   ```js
   assetsInclude: ['**/*.glb']
   ```
4. Download `card.glb` and `lanyard.png` from React Bits repo → `src/assets/lanyard/`
5. Copy `Lanyard.jsx` and `Lanyard.css` to `src/components/` (exact from md)
6. Lazy-load in `About.jsx`:
   ```jsx
   const Lanyard = React.lazy(() => import('./Lanyard'))
   ```
7. Use `position={[0, 0, 20]} gravity={[0, -40, 0]}`
8. Verify bundle size — three.js adds ~300KB gzip; consider code-splitting if total exceeds 400KB gzip

### Yield section (orphaned, easy restore)
`Yield.jsx` is fully built with BorderGlow, GradientText header, stat cards, and partner cards.
To restore: add to `App.jsx` between `<Liquidity />` and `<Partnerships />`, and add `{ label: 'Yield', href: '#yield' }` to `NAV_LINKS` in `Nav.jsx`.

### E2E tests
`tests/e2e/` has spec files written but Playwright browsers have never been installed. Run:
```bash
npx playwright install
npm run test:e2e
```
Tests may need updates — Hero swap widget output text changed; RotatingText is gone.

### Unit tests
16 unit tests were passing as of 2026-06-03. Not re-run since the React Bits polish pass. May need updates for:
- `Hero.test.jsx` — RotatingText is removed, TextType added
- `StatsBar.test.jsx` — stat values now wrapped in GradientText

### GitHub Pages deployment
No repo connected. Setup:
```bash
git init
git remote add origin https://github.com/0xpat/0xpat-portfolio.git
npm run deploy
```

---

## Known Issues / Gotchas

- **Two motion packages co-exist.** `framer-motion` is used by all site components. `motion` (separate npm package, `motion/react` import path) is required by GradientText and RotatingText from React Bits. Both must stay installed — do not remove either.
- **GradientText is a block element.** Its CSS has `display: flex; max-width: fit-content; margin: 0 auto`. Nesting inside `<p>` tags causes invalid HTML and a React DOM warning. Always use `<div>` or `<span>` wrappers around it.
- **Partnerships header missing GradientText.** All other section headers have GradientText — Partnerships uses plain white `<h2>`. Intentional omission from the task scope; easy to add.
- **RotatingText dead code.** `RotatingText.jsx` + `.css` on disk, no imports anywhere. Safe to delete.
- **Folder dead code.** `Folder.jsx` + `.css` on disk, no imports anywhere. Safe to delete.
- **Magnet dead code.** `Magnet.jsx` on disk, not used. Safe to delete.
- **Launchpad stat cards not BorderGlow.** The `30+`, `~$1M`, and `Zero Errors` cards at the bottom of Launchpad use plain static divs, not BorderGlow. Visually inconsistent with the Titan Launch card directly above.
- **Bundle size.** Build outputs `894KB` unminified JS (`275KB` gzip). The Vite chunk size warning is non-blocking. Adding the Lanyard three.js dependency will push this higher.

---

## npm Dependencies

### Production
```json
"framer-motion": "^11.0.0"    // site animations (scroll, enter, hover)
"gsap": "^3.15.0"             // TextType cursor blink animation
"lucide-react": "^1.17.0"     // icon set (verify usage before removing)
"motion": "^12.40.0"          // React Bits components — imports from 'motion/react'
"react": "^18.3.1"
"react-dom": "^18.3.1"
"recharts": "^2.12.0"         // Farms dual-axis line chart
```

### Dev
```json
"@playwright/test": "^1.44.0"
"@testing-library/jest-dom": "^6.4.0"
"@testing-library/react": "^16.0.0"
"@types/react": "^18.3.1"
"@types/react-dom": "^18.3.0"
"@vitejs/plugin-react": "^4.3.0"
"autoprefixer": "^10.4.19"
"gh-pages": "^6.1.1"
"jsdom": "^24.1.0"
"postcss": "^8.4.38"
"tailwindcss": "^3.4.4"
"vite": "^5.3.0"
"vitest": "^1.6.0"
```

---

## vite.config.js (current state)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    globals: true,
    include: ['tests/unit/**/*.{test,spec}.{js,jsx}'],
    exclude: ['tests/e2e/**'],
  },
})
```

`base: '/'` is set for custom domain deployment. Change to `'/0xpat-portfolio/'` if deploying to a `username.github.io` subdomain without a custom domain.

**Pending:** Add `assetsInclude: ['**/*.glb']` when Lanyard is integrated.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| RotatingText replaced by TextType | Typewriter / terminal aesthetic fits DeFi/code theme better than spring-animated character rotation |
| ShinyText scoped to Nav brand only | `0xpat / doxie` uses GlitchText + `.shiny-text` CSS class — not the ShinyText component directly. No ShinyText anywhere else per spec. |
| Magnet not integrated | BorderGlow already provides magnetic-feeling hover interaction; adding a cursor-attraction wrapper on top would be visually redundant and potentially disorienting |
| Folder not integrated | No clear content fit for a 3D folder metaphor — deferred indefinitely |
| Yield removed from App.jsx | Partnerships section covers the same deal-flow narrative more specifically; component preserved for potential restore |
| `motion` package added alongside `framer-motion` | React Bits components import from `'motion/react'` — a different package path from `'framer-motion'`. Both required. |
| GradientText containers changed from `<p>` to `<div>` | GradientText renders as `motion.div` (block); `<p>` cannot contain block elements — Farms ProfitabilityCallout was updated accordingly |
| Launchpad IDO count updated to 30+ | More accurate than the 20+ in the original CLAUDE.md spec |
| Swap button output: `Outcome` | Widget says `Swap` → `Outcome` (not `Hire` / `PAT KUO ✓ Confirmed` from original spec — replaced during an earlier session revision) |

---

## Dev Commands

```bash
npm run dev         # start dev server at localhost:5173
npm run build       # production build → dist/
npm run test        # Vitest unit tests
npm run test:e2e    # Playwright e2e (requires: npx playwright install first)
npm run deploy      # build + gh-pages push (requires GitHub repo)
```
