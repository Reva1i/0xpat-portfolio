# CLAUDE.md — 0xpat Portfolio

## Project Overview

Personal portfolio website for Pat Kuo (0xpat), a DeFi Business Developer at PancakeSwap.
The site is styled as a DEX interface — dark mode, smooth animations, interactive DeFi-native UI primitives.
The goal is to impress DeFi-native hiring teams (specifically targeting Monad Foundation's DeFi Success Lead role).

---

## Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Testing:** Vitest (unit) + Playwright (e2e)
- **Deployment:** GitHub Pages
- **Font:** Inter (body) + JetBrains Mono (numbers, data, code)

---

## Design Direction

### References
- **Morpho** (morpho.org) — magnetic hover interactions, elements that react to cursor
- **Monad App** (app.monad.xyz) — smooth scroll animations, clean dark layout
- **Uniswap** (app.uniswap.org) — DEX UI as the core interaction paradigm

### Visual Language
- **Background:** #0a0a0a (near-black)
- **Surface:** #111111 (card background)
- **Surface elevated:** #1a1a1a
- **Border:** rgba(255,255,255,0.08)
- **Primary text:** #ffffff
- **Secondary text:** #888888
- **Muted text:** #444444
- **Accent:** #7c3aed (purple — PancakeSwap/DeFi native)
- **Accent hover:** #6d28d9
- **Green (positive):** #22c55e
- **Red (negative):** #ef4444

### Typography
- Headlines: Inter 700
- Body: Inter 400
- Numbers/data/addresses: JetBrains Mono
- All data-heavy elements (TVL, volume, deal sizes) should render in JetBrains Mono

### Interaction Principles
- Smooth scroll with Framer Motion scroll-linked animations
- Cards have subtle magnetic hover effect (cursor attraction, ~10px max offset)
- Numbers animate/count up when they enter the viewport
- Section transitions use fade-up (y: 20px → 0, opacity: 0 → 1)
- No jarring transitions — everything eases

---

## Site Structure (Single Page)

### 1. Nav
- Fixed top, blur backdrop
- Left: `0xpat` in JetBrains Mono
- Right: anchor links — Liquidity · Yield · Launchpad · About
- Right: `Connect` button (non-functional, purely aesthetic — shows wallet icon)

### 2. Hero — Swap Widget
The hero is a DEX swap widget easter egg.

**Default state:**
- Input token: `OPPORTUNITY`
- Output token: `PAT KUO`
- Exchange rate line: `1 OPPORTUNITY = 1 PAT KUO (DeFi BD)`
- Swap button label: `Hire`
- Below widget: one-line bio

**On click "Hire":**
- Widget animates (brief spin/pulse on the arrow icon)
- Output changes to: `PAT KUO ✓ Confirmed`
- Below: mailto link appears — `patkuo87225@gmail.com`

**Bio line (below widget):**
> DeFi BD operator. I grow protocol TVL, design incentive programs, and connect ecosystems. Currently at PancakeSwap.

### 3. Stats Bar
A horizontal bar of 4 key metrics, styled like a DEX's 24h stats strip.

| Label | Value | Sublabel |
|---|---|---|
| Peak Monthly Volume | $12.16B | Base Network |
| TVL Sourced | $7M+ | 2026 |
| IDO Launches | 20+ | Zero errors |
| Yield Delivered | ~$500K | To CAKE holders |

- Numbers count up on scroll into view
- Each stat has a small trend indicator (green arrow up)

### 4. Liquidity — Deal Flow
Section header: `Liquidity` (styled like a pool list header)

Intro line:
> Protocol liquidity deals closed across Base, BNBChain, and Monad. Each position represents a structured incentive deal — reward tiers, duration, co-incentive terms, and TVL targets.

**Deal table** (styled like a DEX pool list):
Columns: Protocol · Chain · Type · TVL · Status

| Protocol | Chain | Type | TVL | Status |
|---|---|---|---|---|
| APYx | Base | Stablecoin | $2M | Active |
| earnAUSD | Base | Stablecoin | $1M | Active |
| USD+/USDC | Base | Stablecoin | $1M | Active |
| HeyELSA | Base | Altcoin | $500K | Active |
| VELVET | Base | Altcoin | $700K | Active |
| PIGGY | BNBChain | Altcoin | $600K | Active |
| tGBP | Base | RWA | $250K | Active |
| CADC | Base | RWA | $250K | Active |
| IDRX | Base | RWA | $20K | Active |
| BRZ | Base | RWA | $20K | Active |
| AUDF | Base | RWA | $150K | Active |

Below table:
> + $20M coordinated deployment for U on BNBChain

**Total row:** `$7M+ sourced · $20M coordinated`

### 5. Yield — Syrup Pools
Section header: `Yield`

Intro line:
> Structured token reward programs that deliver passive yield to CAKE holders. Each syrup pool is a partnership deal — project commits rewards, CAKE holders earn.

**Stats:**
- 17 syrup pool partners secured in H2 2025
- ~2 deals per month cadence
- ~$500K total yield delivered to CAKE holders

**Partner cards** (grid, 3 columns):
Show key partners as cards: U ($50K rewards), DeepNode ($30K rewards), + 15 others represented as `+15 partners`

### 6. Launchpad — IDO Record
Section header: `Launchpad`

Intro line:
> 20+ token launches on Binance Wallet IDO with zero delays or errors. Each launch required end-to-end coordination — pool setup, liquidity injection (~$1M per IDO), and post-launch monitoring.

**Highlight card — Titan Launch:**
> OpenGradient × Virtuals
> First-ever Titan Launch outside Uniswap on Base
> $2.91M average daily volume · First 3 days
> OpenGradient subsequently listed on Binance Spot

**Supporting stats:**
- 20+ IDO launches
- ~$1M liquidity supervised per launch
- 0 delays · 0 errors
- Chains: BNBChain · Base

### 7. Farms — Base Growth Story
Section header: `Farms`

This is the growth story section — the most data-heavy part.

**Headline metric:**
> Base Monthly Volume: $3.74B → $12.16B peak

**Chart:**
A simple line chart showing monthly volume progression using the ranking table data:
- Jun 25: $3.83B
- Jul 25: $7.53B
- Aug 25: $10.59B
- Sep 25: $6.96B
- Oct 25: $11.96B
- Nov 25: $8.77B
- Dec 25: $7.24B
- Jan 26: $6.73B
- Feb 26: $5.29B
- Mar 26: $5.86B (PCS #2)
- Apr 26: $3.56B
- May 26: $3.42B

Use Recharts for the chart. Style it dark, accent color for the line.

**Ranking callout:**
> Jul–Nov 2025: PancakeSwap held #2 on Base ahead of Uniswap

**Profitability callout:**
> Farm emissions flipped from –74,193 CAKE/month → +17,815 CAKE/month
> Growing revenue while reducing incentive spend per unit

### 8. About / Contact
Section header: `About`

**Short bio:**
> I'm Pat (0xpat) — DeFi BD operator based in Taipei. I grow protocol ecosystems, structure liquidity deals, and connect DeFi infrastructure to real capital.
>
> Currently: Business Developer at PancakeSwap, focused on Base, BNBChain, and Monad.
>
> Previously: BD & Growth at Teahouse Finance (2022–2025), growing AUM from $2M to $9M.

**Links row:**
- Email: patkuo87225@gmail.com
- Twitter/X: @patheboi
- Telegram: @patheboi
- LinkedIn: pat-kuo-94a049229

**"Connect Wallet" CTA** (aesthetic, opens mailto)

---

## File Structure

```
src/
  components/
    Nav.jsx
    Hero.jsx          # Swap widget
    StatsBar.jsx
    Liquidity.jsx     # Deal table
    Yield.jsx         # Syrup pools
    Launchpad.jsx     # IDO record
    Farms.jsx         # Growth chart
    About.jsx
  hooks/
    useCountUp.js     # Number count-up animation
    useMagneticHover.js
  utils/
    data.js           # All content data (deals, stats, chart data)
  App.jsx
  main.jsx
  index.css
tests/
  unit/
    StatsBar.test.jsx
    Liquidity.test.jsx
    Hero.test.jsx
  e2e/
    hero.spec.js      # Swap widget interaction
    navigation.spec.js
    animations.spec.js
```

---

## Testing Requirements

### Unit Tests (Vitest)
- `StatsBar.test.jsx` — renders all 4 stats with correct values
- `Liquidity.test.jsx` — renders all deals, correct TVL values, correct chain labels
- `Hero.test.jsx` — swap widget renders, "Hire" button click triggers confirmation state, mailto link appears after click

### E2E Tests (Playwright)
- `hero.spec.js` — visit page, click Hire button, confirm output changes to "PAT KUO ✓ Confirmed" and mailto link is visible
- `navigation.spec.js` — all nav anchor links scroll to correct sections
- `animations.spec.js` — stats bar numbers are visible after scrolling into view

---

## Build & Deploy

```bash
# Dev
npm run dev

# Test
npm run test          # Vitest unit tests
npm run test:e2e      # Playwright e2e

# Build
npm run build

# Deploy to GitHub Pages
npm run deploy        # uses gh-pages package
```

**GitHub Pages config:**
- Base URL in vite.config.js: `/` (custom domain) or `/0xpat-portfolio/` (if using github.io subdomain)
- Add `homepage` field to package.json

---

## Content Rules

- All dollar amounts in JetBrains Mono
- Chain names always: `Base` · `BNBChain` · `Monad` (exact casing)
- Never claim Pat "closed" the $20M U deal — always "coordinated deployment"
- Protocol names exactly as listed in data.js
- No profile photo anywhere on the site
- ENS/wallet address style: `0xpat` as the brand handle

---

## Done Criteria

- [ ] All sections render correctly on desktop (1280px) and mobile (375px)
- [ ] Swap widget easter egg works end-to-end
- [ ] Stats count up on scroll
- [ ] Line chart renders with correct data
- [ ] All unit tests pass
- [ ] All e2e tests pass
- [ ] Deployed to GitHub Pages with live URL
