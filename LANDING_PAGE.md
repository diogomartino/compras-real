# Karrinho — Landing Page Brief

A single-source-of-truth brief for building the **Karrinho** marketing landing page as a
**separate Next.js project**. Everything here (colors, type, spacing, components, voice) is
extracted from the real app so the landing page reads as the same product. Follow it closely —
the goal is a visitor feeling "this is clearly the same brand" the moment they open the app.

---

## 1. Product

**Karrinho** (Portuguese for "little cart") is a **mobile-first household grocery app**. A household
keeps a shared product catalog, builds reusable lists, and then shops together in real time — one
person can swipe through items Tinder-style while others watch progress live.

- **Who it's for:** households / families / flatmates who share the grocery run.
- **Core promise:** _the shopping list your whole home shares, and a shopping mode that makes the
  actual trip effortless._
- **Platform:** installable PWA, mobile-first, works great one-handed. Light **and** dark themes.
- **Languages:** English + European Portuguese (built i18n-first — keep landing copy translatable).

### What it does (feature set — use for the feature sections)
| Feature | One-liner |
|---|---|
| **Shared catalog** | A smart, reusable product catalog for the whole household (with images, categories, default quantities). |
| **Reusable lists** | Build named lists ("Weekly basics") once; enabled lists auto-seed each shopping trip. |
| **Realtime shopping mode** | Shop together live — presence avatars, activity feed, and instant sync between everyone in the household. |
| **Swipe or list** | Two shopping styles: a focused **swipe** deck (swipe to check off / skip) or a grouped **list** view. |
| **Store-aisle order** | Drag categories into your store's aisle order; the shopping flow follows it. |
| **Households** | Invite people by email, switch between households, owners manage members. |
| **Suggestions & history** | Recurring-product suggestions, full trip history, and one-tap "shop again" from a past trip. |
| **Native feel** | Undo toasts, haptics, celebration on finish, buttery transitions — engineered to feel like a native app. |

### Voice & tone
Calm, warm, practical, quietly confident. Short sentences. Domestic, not corporate. Never shouty.
"Always ready", "shop together", "effortless". Avoid jargon and exclamation-mark spam.

### Ready-made copy (from the app — reuse or adapt)
- **Hero title:** "Your household grocery list, always ready."
- **Hero subtitle:** "Build a shared catalog, maintain lists, and shop together in real time."
- **Feature chips:** "Reusable lists" · "Realtime shopping mode" · "Smart product catalog"
- **CTA ideas:** "Start your list" · "Open Karrinho" · "Get started — it's free"

---

## 2. Brand assets

Logos live in the app repo at `apps/client/public/v1/` — copy these into the landing project:
- `logo.svg` — primary vector logo (**use this**; scalable, theme-flexible).
- `logo-no-bg.png` — transparent raster fallback (108 KB).
- `logo_square.jpeg` — square app-icon style (used as favicon in the app).
- `ios/`, `android/`, `windows/` — platform icon sets if you need app-store style badges.

App screenshots for device mockups: `apps/client/public/screenshots/` (`mobile.png` 390×844,
`wide.png` 1280×720). Prefer showing the app **inside a phone frame** — it's mobile-first.

**Name:** always "Karrinho" (capital K). **Theme/PWA color:** `#16a34a`.

---

## 3. Color system (the important part)

The app is authored in **OKLCH** (source of truth) and is fully **light + dark**. The landing page
must ship both themes. Copy the token blocks below verbatim into the landing's global CSS. Approximate
hex values are given **only** for visualization — prefer the OKLCH.

### Brand anchors
| Role | Value | Notes |
|---|---|---|
| **Primary green** | `rgb(48, 112, 60)` = **`#30703C`** | The button / brand green. Deep, natural, calm. |
| **Bright green (accent/theme)** | **`#16a34a`** | PWA theme-color; use for the browser chrome, subtle highlights, and the brighter primary in **dark** mode. |
| **Cream background** | **`#F7F2EA`** | Warm off-white app background (PWA `background_color`). The whole brand sits on warm neutrals, not pure white/grey. |

> The palette is **warm green on warm cream** — earthy, grocery-fresh, low-contrast-comfortable.
> Do **not** substitute a cold blue-grey neutral; keep the warm hue in backgrounds and borders.

### Light theme tokens (drop into `:root`)
```css
:root {
  --radius: 0.75rem;
  --background: oklch(0.985 0.012 92);      /* ≈ #FAF7F0 warm cream        */
  --foreground: oklch(0.22 0.025 122);      /* ≈ #262B25 green-charcoal     */
  --card: oklch(1 0.006 92);                /* ≈ #FFFDFB near-white         */
  --card-foreground: oklch(0.22 0.025 122);
  --popover: oklch(1 0.006 92);
  --popover-foreground: oklch(0.22 0.025 122);
  --primary: rgb(48, 112, 60);              /* #30703C brand green          */
  --primary-foreground: oklch(0.99 0.008 110);
  --secondary: oklch(0.94 0.026 105);       /* ≈ #ECE9DC soft sand          */
  --secondary-foreground: oklch(0.27 0.035 128);
  --muted: oklch(0.945 0.018 92);           /* ≈ #ECE8DF                    */
  --muted-foreground: oklch(0.49 0.032 118);/* ≈ #6E7169 muted text         */
  --accent: oklch(0.92 0.055 142);          /* ≈ #DCEBD5 pale green         */
  --accent-foreground: oklch(0.26 0.052 146);
  --destructive: oklch(0.58 0.19 28);       /* ≈ #C6473A red                */
  --border: oklch(0.875 0.025 96);          /* ≈ #DAD5C9 warm border        */
  --input: oklch(0.875 0.025 96);
  --ring: oklch(0.58 0.11 148);             /* focus ring green             */
  --chart-1: oklch(0.58 0.12 148);
  --chart-2: oklch(0.64 0.11 74);
  --chart-3: oklch(0.58 0.09 210);
  --chart-4: oklch(0.7 0.1 116);
  --chart-5: oklch(0.62 0.14 32);
}
```

### Dark theme tokens (drop into `.dark`)
```css
.dark {
  --background: oklch(0.17 0.024 132);      /* ≈ #14180F deep green-black   */
  --foreground: oklch(0.95 0.012 96);       /* ≈ #F1EFE9                    */
  --card: oklch(0.215 0.025 132);
  --card-foreground: oklch(0.95 0.012 96);
  --popover: oklch(0.215 0.025 132);
  --popover-foreground: oklch(0.95 0.012 96);
  --primary: oklch(0.72 0.12 145);          /* ≈ #5FB56F brighter green     */
  --primary-foreground: oklch(0.17 0.024 132);
  --secondary: oklch(0.28 0.032 132);
  --secondary-foreground: oklch(0.94 0.012 96);
  --muted: oklch(0.28 0.024 132);
  --muted-foreground: oklch(0.73 0.024 110);
  --accent: oklch(0.31 0.055 145);
  --accent-foreground: oklch(0.94 0.02 110);
  --destructive: oklch(0.68 0.17 24);
  --border: oklch(1 0 0 / 12%);             /* translucent white border     */
  --input: oklch(1 0 0 / 16%);
  --ring: oklch(0.68 0.11 145);
  --chart-1: oklch(0.7 0.12 145);
  --chart-2: oklch(0.76 0.11 76);
  --chart-3: oklch(0.7 0.09 210);
  --chart-4: oklch(0.75 0.09 116);
  --chart-5: oklch(0.72 0.13 32);
}
```

### Semantic usage
- **background / foreground** — page canvas + primary text.
- **card** — every panel, feature card, testimonial sits on `card` with a `border` at ~70% opacity
  (`border-border/70`) — soft, not hard lines.
- **primary** — main CTAs, links, active states, the logo mark.
- **muted / muted-foreground** — secondary text, captions, footnotes.
- **accent** — subtle green wash behind icons / highlighted chips (pale, never loud).
- **secondary** — quiet chips / secondary buttons.
- **destructive** — reserved; you likely won't need it on a landing page.

---

## 4. Typography

**Typeface: Inter** (the only font — one family, weights do the work).

In Next.js use `next/font/google`:
```ts
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });
```
App font stack (fallback order): `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

**Weights actually used:** `400` normal, `500` medium, `600` semibold. **No bold/800** — headings are
**semibold**, not black. Keep it that way; it's part of the calm feel.

### Type scale (mirror these exact Tailwind steps)
| Role | Classes | Use |
|---|---|---|
| Display / hero | `text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl` | The single big hero headline. |
| H1 | `text-3xl font-semibold leading-tight tracking-tight sm:text-5xl` | Section headers. |
| H2 | `text-2xl font-semibold leading-tight tracking-tight sm:text-4xl` | Sub-sections. |
| H3 | `text-xl font-semibold leading-snug sm:text-2xl` | Card titles. |
| H4 | `text-lg font-semibold leading-snug` | Small headings. |
| Body L | `text-lg leading-relaxed` | Hero subtitle / lead paragraphs. |
| Body | `text-base leading-relaxed` | Default paragraph. |
| Body S | `text-sm leading-relaxed` | Captions, meta. |
| Caption | `text-xs leading-relaxed` | Fine print, labels. |

Details that matter: headings use **`tracking-tight`** + **`text-balance`**; body copy uses
**`text-pretty`** and **relaxed** leading. Text tones: default, `muted-foreground`,
`muted-foreground/75` (subtle).

---

## 5. Spacing, radius & layout

### Radius scale (rounded, friendly — nothing sharp)
Base `--radius: 0.75rem` (12px), scaled:
| Token | Value | Typical use |
|---|---|---|
| sm | `0.45rem` | tiny chips |
| md | `0.6rem` | inputs, small controls |
| lg | `0.75rem` | default |
| **xl** | `1.05rem` | **cards / surfaces (the default look)** |
| 2xl | `1.35rem` | large cards |
| 3xl | `1.65rem` | hero panels |
| pill | `9999px` | badges, chips, the pill buttons used throughout |

Cards and most surfaces use **`rounded-xl`/`rounded-2xl`**; chips and many buttons are **fully
rounded pills**. When in doubt, round more, not less.

### Spacing rhythm
- Vertical spacing between stacked elements: **`gap-4`** (16px) default inside cards, **`gap-6`–`gap-8`**
  between page sections; large landing sections can breathe more (`py-16`–`py-24`).
- Card padding: **`p-4`** (`sm`) / **`p-6`** (`lg`). Use `p-6` for landing feature cards.
- **Content max-width:** the app centers content at **`max-w-3xl`** (768px) for reading columns and
  **`max-w-5xl`/`max-w-7xl`** for wide layouts. For the landing use a **`max-w-6xl`/`max-w-7xl`**
  centered container with `px-4 sm:px-6 lg:px-8`.
- Grid gaps `gap-3`–`gap-4`; multi-column feature grids `sm:grid-cols-2 lg:grid-cols-3`.

---

## 6. Component style guide (match these so CTAs/cards feel native)

### Buttons
Base: `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold select-none
transition-[color,background-color,border-color,box-shadow,transform] duration-150
active:scale-[0.97]`. **Press = a subtle 3% scale-down** (this micro-interaction is core to the feel —
add it to landing CTAs too). Focus: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`.

Variants:
- **primary (default):** `bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80`
- **outline:** `border border-border/80 bg-background/70 hover:bg-accent hover:text-accent-foreground`
- **secondary:** `bg-secondary text-secondary-foreground hover:bg-secondary/80`
- **ghost:** `hover:bg-accent hover:text-accent-foreground`
- **link:** `text-primary underline-offset-4 hover:underline`

Sizes: default `h-11 px-4`, sm `h-9 px-3`, lg `h-12 px-6`. Landing hero CTA → `lg`, primary, often
paired with an `outline` secondary. Buttons frequently carry a **Lucide icon** on the left (`size-4`).

### Cards / surfaces
`rounded-xl border border-border/70 bg-card/75 text-card-foreground p-6`. Optional elevated variant:
add `bg-card shadow-sm shadow-black/5`. Shadows are **very soft and low** (`shadow-black/5`) — no
heavy drop shadows. Many surfaces use translucency (`/75`, `/85`) over the warm background.

### Chips / badges (status pills)
Small fully-rounded pills: `rounded-full border px-3 py-1 text-xs font-medium`. Tonal fills like
`bg-primary/10 text-primary` (success/brand), `bg-muted text-muted-foreground` (neutral). Great for
the hero feature chips and "New" tags.

### Inputs (if you add a waitlist/newsletter form)
`h-11 rounded-xl border border-input bg-background px-3 text-sm`, focus ring as above. Match the
button height (`h-11`) when placing an input + button inline.

### Icons
**Lucide** (`lucide-react`) throughout the app — use the same library on the landing so iconography
matches. Icons are line-style, `size-4`/`size-5`, `currentColor`. Representative icons already used:
`ShoppingCart, ListChecks, PackageSearch, Users, Home, Sparkles, Check, Hand, History, RotateCcw`.

---

## 7. Motion & feel

The app's tagline internally is "smooth like a native app." Bring that restraint to the landing:
- **Micro-interactions:** the `active:scale-[0.97]` press on buttons/cards; gentle `hover` lifts.
- **Entrance:** short, soft fades / small `y`/`scale` reveals (opacity 0→1, y 8→0, ~180–250ms,
  `ease-out`). Nothing bouncy or long. The app uses **Framer Motion** (`motion`); it's a fine choice.
- **Always** honor `prefers-reduced-motion` (the app hard-disables animation there — do the same).
- Optional: an animated phone showing the **swipe shopping** interaction is the hero money-shot.

---

## 8. Suggested page structure

1. **Sticky top bar** — logo + name left; nav (Features · How it works · maybe Pricing) center/right;
   a primary CTA button right. Transparent → `bg-background/80 backdrop-blur` on scroll.
2. **Hero** — display headline + subtitle + primary/outline CTA pair + a phone mockup showing the
   swipe or list screen. Warm cream background, maybe a very soft green radial glow.
3. **Feature chips / social proof strip** — the three chips + "works offline / installable" line.
4. **Feature sections** — alternating text ↔ device screenshot, one per pillar (Shared catalog,
   Reusable lists, Realtime shopping, Swipe mode, Households). Use `card` panels, warm accents.
5. **"How it works"** — 3 steps: _Build your catalog → Prep your list → Shop together._
6. **Secondary highlights grid** — suggestions, history/"shop again", aisle order, haptics/undo.
7. **Final CTA band** — primary green, big headline, one button. (Green `bg-primary` band with
   `primary-foreground` text.)
8. **Footer** — logo, small nav, language note (EN/PT), copyright, theme toggle.

Include a **light/dark theme toggle** (the app is fully dual-theme; the landing should be too —
default to light/cream).

---

## 9. Next.js implementation notes

- **Tailwind v4** (the app uses it) — define the palette with `@theme` mapping the CSS vars above,
  exactly like the app's `apps/client/src/index.css`. Dark mode via a `.dark` class on `<html>`
  (`@custom-variant dark (&:is(.dark *))`), toggled by a small client component (consider
  `next-themes`, which the app uses).
- **Fonts** via `next/font/google` Inter (weights 400/500/600), applied on `<body>`.
- **Colors** — keep them as CSS variables + OKLCH; don't hardcode hex in components. Reference
  `bg-primary`, `text-muted-foreground`, `border-border/70`, etc. so it maps 1:1 to the app.
- **Images** — use `next/image`; frame app screenshots in a phone mockup. Keep the logo as inline
  SVG (`logo.svg`) so it inherits color and stays crisp.
- **Accessibility** — semibold (not thin) headings on the warm background already give decent
  contrast; verify muted text meets AA. Keep the `focus-visible` ring. Respect reduced motion.
- **SEO/meta** — title "Karrinho", `theme-color` `#16a34a`, OG image using the green/cream brand.

### Do / Don't
- ✅ Warm cream + natural green, soft borders, rounded-xl, pill chips, subtle shadows, semibold heads.
- ✅ One font (Inter), calm copy, gentle motion, dual theme, mobile mockups.
- ❌ Cold blue-grey neutrals, pure-white harsh cards, heavy drop shadows, sharp corners, black/800
  headings, neon greens, dense corporate copy, stock-photo people. Keep it homey and clean.

---

_Source of truth for tokens: `apps/client/src/index.css`, `apps/client/index.html`, and the design-system
components in `apps/client/src/components/ds/*`. If anything here is ambiguous, that code wins._
