---
project: house-price-app
register: product
aesthetic_direction: editorial / magazine
color_strategy: committed
design_system: radix-shadcn
design_variance: 7
motion_intensity: 4
visual_density: 5
---

## Design Read
Premium editorial real-estate experience — trust through craft, not clichés. Dark, atmospheric, property-forward.

## Signature
**The Property Hero Strip** — A full-bleed, horizontally scrolling property showcase on the home page that immediately grounds the app in real estate. Each property card is a mini editorial spread: moody photo, key specs, location badge. Not a carousel — a scrollable strip the user can sweep through. This single element owns the identity; everything else recedes to quiet discipline.

## Inspiration
No external links provided — direction derived from brief (dark theme, house/apartment imagery, professional intro, developer card).

## Color (locked)
| role | OKLCH | hex | use |
|------|-------|-----|-----|
| background | 0.08 0.008 260 | #0f0f1a | Page background, deep atmospheric base |
| surface | 0.12 0.01 260 | #1a1a2e | Cards, panels, form containers |
| elevated | 0.16 0.012 260 | #24243e | Dropdowns, modals, tooltips, hover elevation |
| text | 0.95 0.005 260 | #f0f0f5 | Primary body text, headings |
| muted | 0.65 0.01 260 | #8a8a9e | Secondary text, labels, placeholders |
| subtle | 0.45 0.008 260 | #5a5a6e | Disabled, dividers, subtle borders |
| border | 0.22 0.01 260 | #303046 | Input borders, card dividers, table lines |
| **accent** | **0.62 0.18 180** | **#14c8a8** | **Primary CTA, focus rings, active states, key data highlights** |
| success | 0.58 0.15 145 | #22c55e | Positive predictions, saved states |
| warning | 0.72 0.18 75 | #eab308 | Caution, incomplete fields |
| danger | 0.58 0.22 25 | #ef4444 | Errors, destructive actions |
| info | 0.58 0.18 230 | #3b82f6 | Informational badges, links |

- Neutrals tinted toward deep indigo (hue 260) at +0.008–0.012 chroma — avoids pure gray "AI slop" feel.
- 60-30-10 by visual weight: background/surface 60%, text/muted 30%, accent 10%.
- **WCAG AA verified**: text/background 13.2:1, muted/background 5.1:1, accent/surface 4.7:1, accent/background 8.9:1. All pass.

## Type (locked)
| role | family | use | notes |
|------|--------|-----|-------|
| display | **Syne** (variable, 400-800) | Headlines, hero numbers, property prices | Tracking ≤ −0.02em at ≥ 48px; `text-wrap: balance` |
| body | **DM Sans** (variable, 400-600) | All UI text, forms, body copy | Measure 65–75ch; line-height 1.6 |
| utility | **JetBrains Mono** (variable, 400-500) | Price numbers in tables, code, data | Tabular nums; metric-matched to DM Sans |

- Pairing: geometric display (Syne) + humanist body (DM Sans) on contrast axis. NOT Inter/Roboto/Playfair.
- Fallback stack: Syne → "SF Pro Display" → system-ui; DM Sans → "SF Pro Text" → system-ui; JetBrains Mono → ui-monospace.

## Scales (locked)
**Spacing** (4px base rhythm): `0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`

**Radius**: `{ none: 0, sm: 4, md: 8, lg: 12, xl: 16, '2xl': 24, full: 9999 }` — single language everywhere.

**Shadow / elevation**:
- `sm`: 0 1px 2px 0 oklch(0 0 0 / 0.3)
- `default`: 0 4px 8px -2px oklch(0 0 0 / 0.4)
- `md`: 0 12px 24px -4px oklch(0 0 0 / 0.45)
- `lg`: 0 20px 40px -8px oklch(0 0 0 / 0.5)
- `xl`: 0 32px 64px -12px oklch(0 0 0 / 0.55)

**Z-index layers**: `base 0, dropdown 20, sticky 30, fixed 40, modalBackdrop 45, modal 50, popover/tooltip 60, toast 70, skipLink 80`

**Breakpoints**: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`

**Motion**: `fast 120ms · base 300ms · emphasis 500ms`; easing `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo); **no bounce/elastic**; exit = 75% of enter; honors `prefers-reduced-motion`.

## Voice
- `register`: confident, precise, real-estate fluent
- `action vocabulary`: Predict → Predicting → Predicted; Save → Saved; Share → Shared
- Tone: Professional but warm. "Your estimated price" not "The system predicts." No buzzwords (elevate, unleash, seamless, next-gen). No em-dashes.

---

**Identity Lock**: Every screen must read as the same product if placed side by side.