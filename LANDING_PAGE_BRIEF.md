# Grocery App Landing Page Brief

## Product Summary

This app is a shared household grocery system built around three ideas:

- Keep a reusable household product catalog.
- Maintain Base Lists for products that should regularly come back.
- Shop together in real time with a live list or swipe-based shopping mode.

It is designed for households that want one shared source of truth before, during, and after grocery shopping.

## Core User Flow

### 1. Create Or Join A Household

Users create an account with email/password or Google sign-in. When a new user registers, the app automatically creates a household and an active ongoing list.

### 2. Build The Product Catalog

The household creates catalog products with:

- Product name.
- Image URL.
- Category.
- Default quantity and unit.
- Optional source URL.

Products can also be imported from supported product-page links, where the app attempts to extract product details automatically.

### 3. Organize Categories

Users can create, rename, and delete categories. Categories organize the catalog, Base Lists, ongoing list, shopping list mode, and swipe mode.

### 4. Create Base Lists

Base Lists are reusable grocery templates. A household can have multiple Base Lists, such as weekly basics, cleaning supplies, or baby essentials.

Each Base List can be enabled or disabled. Enabled Base Lists automatically seed the next shopping list after a shopping trip is finished.

### 5. Prepare The Ongoing List

The Home screen shows the current ongoing list. Users can add catalog products, edit quantities, and remove products.

The add-products dialog supports:

- Searching the catalog.
- Selecting multiple products at once.
- Recent products when search is empty.
- Preventing duplicates already in the ongoing list.

### 6. Start Shopping

The bottom navigation includes a central Shop action. Before entering shopping mode, users see a preview dialog with:

- Product count.
- Category count.
- Default shopping mode.
- Warnings for uncategorized products.
- Warnings for products without images.
- Options to review the list, add products, or start shopping.

### 7. Shop Together In Real Time

Shopping mode is household-wide and real time. When one household member starts shopping, other household members are redirected into the active shopping session.

The app supports two shopping layouts:

- List mode.
- Swipe mode.

All item status changes sync live between household members.

### 8. Finish Shopping

Shopping can only be finished when all products are resolved. Pending and ignored products must be handled first.

When shopping is finished:

- The current list is marked as finished.
- A new active ongoing list is created.
- Enabled Base Lists seed the new list.
- Duplicate seeded products are discarded instead of duplicated.
- The finished list becomes available in shopping history.

## Main Features

## Authentication

- Email/password registration and login.
- Google login and registration.
- Automatic household creation on registration.
- Password reset flow.
- Change password from Profile.
- Logout.

## Household Grocery Catalog

- Create products.
- Edit products.
- Delete products.
- Search products and categories.
- Product image fallback when images are missing or broken.
- Product default quantity and unit.
- Optional product source URL.
- Product import from supported product links.
- Recent products powered by product usage tracking.

## Category Management

- Create categories.
- Rename categories.
- Delete categories.
- Product counts per category.
- Deleting a category keeps products and leaves them uncategorized.

## Base Lists

- Create multiple Base Lists per household.
- Rename Base Lists.
- Enable or disable Base Lists.
- Delete Base Lists.
- Add products to a Base List.
- Edit Base List product quantities.
- Remove products from a Base List.
- Search inside a Base List.
- Products can appear in multiple Base Lists.
- Products cannot be duplicated inside the same Base List.
- Enabled Base Lists automatically seed the next ongoing list after shopping is finished.

## Ongoing List

- One current household list for the next shop.
- Add multiple products at once.
- Edit quantities.
- Remove products.
- Search ongoing products.
- Group products by category.
- Sort products alphabetically within categories.
- Keep uncategorized products last.

## Start Shopping Preview

- Shows shopping readiness before entering shopping mode.
- Displays product count.
- Displays category count.
- Displays default shopping mode.
- Warns about uncategorized products.
- Warns about missing images for swipe mode.
- Lets users add products, review the list, cancel, or start shopping.

## Real-Time Shopping Mode

- Household-wide active shopping session.
- Automatic redirect into shopping mode when a household member starts shopping.
- Real-time product status updates.
- Live shopper presence.
- Live activity updates.
- Current user activity is hidden from their own activity feed but shown to others.
- Cancel shopping with confirmation.
- Cancel resets item statuses and keeps the ongoing list intact.

## Shopping List Mode

- Category-grouped shopping list.
- Check products as bought.
- Discard products.
- Compact aisle-list mode.
- Sticky category headers in compact mode.
- Comfort mode for larger rows.
- Live status strip showing active shoppers and recent activity.

## Swipe Shopping Mode

- Mobile-first full-screen swipe interface.
- Product image-focused layout.
- Left swipe marks checked.
- Right swipe ignores or discards, depending on review mode.
- Category chips at the top.
- Current product category is highlighted.
- Automatically progresses through products in the selected category, then moves to the next category.
- Stacked active shopper avatars.
- Three-dot menu for list view, main list, and cancel actions.
- Activity toast pills for other household members.
- Custom progress bar showing checked, skipped/discarded, and total progress.
- Green/grey feedback overlays during swipe gestures.
- End-of-list skipped review prompt.

## Shopping Completion

- Finish shopping only when every item is resolved.
- Checked products count toward completed shopping.
- Discarded products are tracked.
- Ignored products must be reviewed or discarded before finishing.
- Finished shopping creates a historical record.
- A new active ongoing list is created immediately after finishing.

## Shopping History

- View previous finished shopping lists.
- See who started each shopping session.
- See shopping start date.
- See checked and discarded counts.
- Review item statuses from past shops.

## Profile And Preferences

- Profile summary with avatar and email.
- Language picker with native language names: English and Português.
- Default shopping mode preference: list or swipe.
- Compact aisle-list preference.
- Haptic feedback preference.
- Haptics test button.
- Action sounds preference.
- Wake lock preference to keep the screen awake while shopping.
- Shopping history link.
- Change password.
- Logout.

## Internationalization

- i18next-powered translations.
- English support.
- European Portuguese support.
- Language preference persisted through browser local storage.
- UI copy translated across screens and shared components.

## PWA Features

- Installable Progressive Web App.
- Web app manifest.
- App icons.
- Screenshots.
- iOS metadata and icons.
- Service worker generation.
- Designed for mobile use.

## Mobile UX Details

- Bottom navigation with Home, Base Lists, Shop, Catalog, and Profile.
- Central Shop call-to-action.
- Mobile-first shopping mode.
- Full-screen swipe mode on mobile.
- Top-positioned toast notifications.
- Toast close button.
- Haptic feedback for shopping actions where supported.
- Optional wake lock during shopping.

## Realtime And Sync

- tRPC over WebSocket.
- Shopping updates delivered live.
- Presence updates for active shoppers.
- Activity events for checked, ignored, and discarded products.
- Shared state between list mode and swipe mode.

## Suggested Landing Page Sections

## Hero

Headline ideas:

- A shared grocery list that actually works while you shop.
- Plan together. Shop together. Never rebuild the same list again.
- The household grocery app for reusable lists and real-time shopping.

Subheadline idea:

Build your household catalog, keep reusable Base Lists, and shop live with your family in list or swipe mode.

Primary CTA ideas:

- Start your household list.
- Create your grocery catalog.
- Try shopping mode.

Secondary CTA ideas:

- See how it works.
- Explore features.

## How It Works

1. Build your catalog.
2. Create reusable Base Lists.
3. Add products to the ongoing list.
4. Start shopping together.
5. Finish and automatically prepare the next list.

## Feature Highlights

- Shared household catalog.
- Reusable Base Lists.
- Real-time shopping mode.
- Swipe shopping on mobile.
- Shopping history.
- Smart recent products.
- English and European Portuguese.
- Installable PWA.

## Real-Time Shopping Section

Core message:

Everyone sees the same shopping session. When one person checks or discards an item, the whole household sees it instantly.

Feature bullets:

- Live shopper presence.
- Live activity updates.
- Shared item statuses.
- List and swipe modes stay in sync.

## Base Lists Section

Core message:

Stop rebuilding the same grocery list every week. Base Lists automatically bring back the staples you always need.

Feature bullets:

- Multiple Base Lists.
- Enable or disable each list.
- Automatic seeding after each shop.
- Quantity defaults per product.

## Swipe Mode Section

Core message:

A fast, thumb-friendly shopping flow for mobile grocery trips.

Feature bullets:

- Swipe left to check.
- Swipe right to skip or discard.
- Product images front and center.
- Category chips and live shopper avatars.
- Progress always visible.

## Shopping History Section

Core message:

Every finished trip becomes a useful record of what was bought, skipped, or discarded.

Feature bullets:

- Finished shopping history.
- Started-by user and date.
- Checked and discarded counts.
- Item-level status review.

## Settings Section

Core message:

Every shopper can tune the app to how they like to shop.

Feature bullets:

- Default list or swipe mode.
- Compact aisle-list mode.
- Haptics.
- Sounds.
- Wake lock.
- English and Portuguese.

## Audience

Best for:

- Couples sharing groceries.
- Families with recurring staples.
- Roommates coordinating shopping.
- Anyone who shops from the same list repeatedly.

## Differentiators

- Built around household collaboration, not a single-user checklist.
- Reusable Base Lists make recurring groceries effortless.
- Shopping mode is real time and mobile-first.
- Swipe mode offers a faster alternative to traditional checkbox lists.
- Finishing a shop automatically prepares the next one.

## Tone For Landing Page Copy

Recommended tone:

- Calm.
- Practical.
- Household-focused.
- Mobile-first.
- Less “productivity app”, more “makes grocery shopping smoother”.

Avoid:

- Overly corporate language.
- Generic AI/productivity claims.
- Feature lists without explaining the household flow.
