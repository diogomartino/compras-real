# Compras Landing Page Specification

## Purpose

Build a public marketing landing page for **Compras**, a shared household grocery app. This is a separate Next.js project, not a redesign of the product itself. Its job is to make the household workflow immediately understandable and send a visitor to the existing app to create an account.

The page should feel like the app: calm, useful, friendly, and made for the ordinary work of running a home. It should communicate a real product, not use vague productivity language or generic startup claims.

## Product Truth

Compras gives one household a shared grocery system:

- Build a household catalog of products, quantities, and categories.
- Create reusable **Base Lists** for recurring needs such as weekly basics or cleaning supplies.
- Keep one ongoing list for the next shop.
- Start a real-time household shopping session in list or swipe mode.
- Finish a trip and automatically begin the next list from enabled Base Lists.

It is for couples, families, and housemates who share shopping. It supports English and European Portuguese and is an installable, mobile-first PWA.

Use the product terms exactly: **catalog**, **Base Lists**, **ongoing list**, **shopping mode**, **list mode**, **swipe mode**, and **shopping history**. Do not call Base Lists “templates,” the ongoing list a “cart,” or the product an AI assistant.

## Audience And Message

Primary audience: people in a shared home who repeatedly buy many of the same things and need the list to stay correct while someone is in the shop.

Core message: **Plan together. Shop together. Start the next list without starting over.**

Supporting message: Build your household catalog once, bring back recurring groceries with Base Lists, and see every shopping action live.

Suggested primary CTA: **Start your household list**

Suggested secondary CTA: **See how it works**

The primary CTA should link to the app registration URL, supplied as a single environment variable such as `NEXT_PUBLIC_APP_URL`. The secondary CTA scrolls to the workflow section. Repeat the primary CTA in the header, hero, and final section.

## Brand Direction

The product UI is warm and practical rather than cold or corporate. Preserve that feeling while making the landing page more editorial and spacious.

### Color Tokens

Use these values as the base palette. The light theme is the landing page default. Dark mode is not required for the first version.

```css
:root {
	--canvas: oklch(0.985 0.012 92);       /* warm off-white */
	--surface: oklch(1 0.006 92);          /* cards and navigation */
	--ink: oklch(0.22 0.025 122);          /* forest-charcoal text */
	--muted-ink: oklch(0.49 0.032 118);
	--brand: rgb(48 112 60);               /* app primary green */
	--brand-strong: oklch(0.42 0.105 148);
	--brand-soft: oklch(0.92 0.055 142);
	--leaf-soft: oklch(0.94 0.026 105);
	--line: oklch(0.875 0.025 96);
	--warning: oklch(0.64 0.11 74);
	--info: oklch(0.58 0.09 210);
	--danger: oklch(0.58 0.19 28);
}
```

Use `--canvas` for the page, `--surface` for device screens and small repeated cards, and forest green for primary actions. Add variety through pale leaf green, warm yellow, and restrained blue data accents. Do not introduce purple, neon colors, dark navy page backgrounds, glassmorphism, or floating gradient-orb decoration.

### Typography

Use **DM Sans** from `next/font/google` for all display and body text. It has a friendly, compact, contemporary shape suitable for product UI and household editorial copy. Use weights 400, 500, 600, and 700.

- Hero heading: 56px desktop / 40px mobile, weight 700, line-height 1.05.
- Section heading: 40px desktop / 32px mobile, weight 700, line-height 1.1.
- Card heading: 20px, weight 700, line-height 1.25.
- Body: 17px desktop / 16px mobile, weight 400, line-height 1.55.
- Small labels and navigation: 14px, weight 600, line-height 1.25.

Do not use negative letter spacing. Headings should remain sentence case, apart from the product name and standard acronym casing.

### Layout And Rhythm

- Content width: 1160px maximum, with 24px side padding on mobile and 40px on desktop.
- Grid: 12 columns on desktop, 6 on tablet, 4 on mobile.
- Section spacing: 128px desktop, 88px tablet, 64px mobile.
- Internal section spacing: use a 4px scale; common gaps are 12px, 16px, 24px, 32px, and 48px.
- Component radius: 12px, matching the app. Device frames may use 28px only because they represent physical hardware.
- Borders: 1px solid `--line`; shadows should be low and warm, for example `0 18px 45px rgb(43 74 43 / 10%)`.

Avoid turning every section into a floating card. Sections should be full-width bands with a constrained inner layout. Cards are reserved for repeated feature items and visible app-interface mockups.

## Page Architecture

### 1. Header

Use a slim, sticky header with the Compras wordmark on the left, anchor navigation in the center, and the primary CTA on the right. On scroll, add a lightly opaque `--canvas` background, bottom border, and subtle blur.

Navigation labels: `How it works`, `Shop together`, `Base Lists`, `History`.

On mobile, use the wordmark, CTA, and a menu button that opens a real accessible sheet or dropdown. Do not leave mobile navigation as decorative-only.

For the wordmark, use “Compras” in DM Sans 700 with a simple grocery basket or check icon from Lucide. Avoid a bespoke logo until a real one exists.

### 2. Hero

Place a two-column hero beneath the header. The left column contains copy; the right is a large product collage that makes the app visible in the first viewport.

Copy:

- Eyebrow: `A shared grocery app for your household`
- H1: `The grocery list that keeps your household in sync.`
- Body: `Build one catalog, bring back the essentials, and shop together in real time - from the sofa to the supermarket aisle.`
- Primary CTA: `Start your household list`
- Secondary CTA: `See how it works` with a down-arrow icon.
- Proof line below CTAs: `Built for families, couples, and shared homes.`

Hero visual: create a large, angled mobile-device mockup of swipe mode in front of a wider desktop/list-mode panel. The UI must look like a real grocery app: category chips, product photos, checked state, quantity, progress, and two small overlapping household avatars. Show plausible product names such as Tomatoes, Olive oil, Oat milk, and Pasta. Use actual grocery product photography or clean generated grocery images; do not use generic business imagery, phone placeholders, or decorative vectors as the central visual.

Let the next section begin just below the fold on both mobile and desktop. The hero itself must not be placed inside a card.

### 3. Household Workflow

Anchor ID: `how-it-works`. Use the heading `One household rhythm, from plan to checkout.` Then present five numbered stages in a horizontal rail on desktop and vertical sequence on mobile:

1. **Build your catalog** - Keep the products, categories, and quantities your home already knows.
2. **Set up Base Lists** - Save weekly basics, cleaning supplies, or anything that comes back.
3. **Grow the ongoing list** - Add what you need next, together.
4. **Start shopping** - Choose a live list or a thumb-friendly swipe flow.
5. **Finish and reset** - Complete the trip and let enabled Base Lists prepare the next one.

Pair the sequence with a single tall app mockup showing the ongoing list. The visual should have a warm paper-like background and clear green action elements, matching the app tokens.

### 4. Real-Time Shopping

Anchor ID: `shop-together`. Use an asymmetric split: a wide shopping-list product visual on the left and copy on the right.

Heading: `When one person shops, everyone sees it.`

Body: `Start one shopping session for the household. Checked, ignored, and discarded items update live, so nobody buys the same thing twice.`

Supporting points with Lucide icons:

- `Live household presence`
- `Instant item updates`
- `List and swipe modes stay in sync`

The app mockup should depict an active session: a compact row of avatars, an activity pill such as “Marta checked Oat milk,” category grouping, and a visible completion summary. Use Motion for a restrained looping state change only if it respects reduced-motion preferences.

### 5. Swipe Mode

Use a green-tinted full-width band with an immersive phone mockup. This is the most visual product story and must not be reduced to a tiny feature card.

Eyebrow: `Made for the aisle`

Heading: `A quicker way to shop with one thumb.`

Body: `Swipe through products with photos, keep an eye on category progress, and handle the list without slowing down.`

Show three concise callouts positioned beside, not over, the phone:

- `Swipe to check or skip`
- `See the next category at a glance`
- `Keep shared progress in view`

The phone UI should show a product photograph as the primary visual, category chips, progress bar, active shopper avatars, and an obvious green completion direction. Make the swipe action understandable without explanatory UI paragraphs.

### 6. Base Lists

Anchor ID: `base-lists`. Use a text-led left column with a detailed app panel on the right.

Heading: `Your staples should not start from zero.`

Body: `Create Base Lists for the things your home needs again and again. Keep them enabled and they will seed the next ongoing list when a shopping trip is finished.`

Show a realistic Base Lists panel with at least three named lists: `Weekly basics`, `Cleaning cupboard`, and `Breakfast`. Use switches for enabled/disabled states, item counts, and a small “Added to next list” confirmation. This must communicate the automatic return of staples, not just a saved checklist.

### 7. Catalog And History

Use two equal supporting feature blocks on an unframed grid. They are complementary, not primary hero content.

**A household catalog that remembers the details**

`Keep products, categories, default quantities, source links, and recent picks in one place.`

Visual: compact catalog rows with grocery thumbnails, category tags, and quantities.

**A useful record of every trip**

`Review finished shops, see what was bought or discarded, and add past items back when you need them.`

Visual: a history list with dates, starter avatar, and checked/discarded totals.

### 8. Preferences And PWA

Use a quieter, compact band. Heading: `Fits the way each person shops.`

Include a row of icon-led details: `English and Portuguese`, `List or swipe by default`, `Optional haptics and sounds`, `Keep the screen awake while shopping`, and `Installable on your phone`.

Do not claim App Store or Google Play availability. The correct claim is that it is an installable PWA.

### 9. Final CTA And Footer

End on a full-width deep forest-green band with a warm off-white type treatment.

Heading: `Make the next grocery trip a shared one.`

Body: `Create your household, add the essentials, and keep the whole list moving together.`

CTA: `Start your household list`.

Footer: wordmark, the same section links, `Privacy`, and `Terms` placeholders. Keep it compact. Only include social icons if actual destination URLs are available.

## Visual Assets And Product Mockups

Use a combination of real grocery imagery and bespoke HTML/CSS product-interface mockups. Product UI is the proof, so it must be the dominant visual asset throughout the page.

- Source product photography from a licensed image provider or create consistent original bitmap assets. Use 1:1 crops and name assets clearly.
- Prefer genuine app screenshots when they become available. Until then, mockups must use the tokens and component conventions in this document.
- Use Lucide for interface and feature icons. Do not hand-draw SVG icon replacements.
- Avoid stock photography of people looking at phones, grocery-store aisles without product context, illustrations of floating groceries, and abstract visual noise.
- Device frames should be subtle. The interface, not the chrome, is the focus.

## Interactions, Accessibility, And Responsive Behavior

- Implement smooth in-page anchor scrolling, with header offset so headings remain visible.
- Use semantic landmarks, one H1, logical heading levels, visible keyboard focus, and descriptive CTA labels.
- Meet WCAG AA contrast; do not convey an item state with color alone.
- Respect `prefers-reduced-motion`. Motion should be brief, purposeful, and never required to understand the product.
- Desktop hero: text and product visual share the width; product visual may slightly overflow the container to the right.
- Tablet: preserve two columns where comfortable, otherwise place visual after copy.
- Mobile: single column, text first. Keep phone mockups large enough to read but within the viewport. The header CTA stays visible; navigation moves to the menu.
- Use `clamp()` only for spacing and media dimensions, not font-size scaling. Use the explicit responsive type sizes above.
- Ensure no screen visual has text too small to inspect, clipped controls, or overlapping callouts at any viewport.

## Next.js Implementation Guidance

- Use Next.js App Router, TypeScript, and Tailwind CSS.
- Load DM Sans with `next/font/google`; expose the palette and spacing as CSS custom properties and map them into Tailwind theme values.
- Build reusable components for `Header`, `Hero`, `Workflow`, `ProductMockup`, `FeatureBand`, `FinalCta`, and `Footer`; do not make one monolithic page component.
- Use `lucide-react` for icons and `motion` only for the few meaningful interactions described above.
- Make the primary CTA target configurable through `NEXT_PUBLIC_APP_URL`; do not hard-code a development URL.
- Optimize bitmap assets through `next/image`, with explicit dimensions and useful alt text.
- Include metadata: title `Compras - Grocery shopping, shared`, description `A shared household grocery list with reusable Base Lists and real-time shopping.`, an Open Graph image, favicon, and theme color matching `--brand`.

## Acceptance Checklist

- The first viewport explains that this is a shared household grocery app and shows a credible product UI.
- The actual product flow is clear: catalog -> Base Lists -> ongoing list -> live shopping -> next list.
- Color, radius, typography, and component density clearly relate to the existing app.
- The page does not use generic SaaS copy, a generic landing-page illustration, or unsubstantiated feature claims.
- It is polished and usable from 320px mobile through wide desktop without overlap or clipped text.
- All links, navigation, CTA scrolling, mobile menu, and reduced-motion behavior work.
- The project builds cleanly with its chosen Next.js tooling.
