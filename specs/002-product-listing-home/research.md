# Research: Product Listing Home Screen

**Phase 0 — All NEEDS CLARIFICATION items resolved**  
**Date**: 2026-03-06

---

## Decision 1: Two-Column Grid Implementation

**Decision**: `FlatList` with `numColumns={2}`  
**Rationale**: `FlatList` is React Native's virtualised list — only renders visible rows, reclaims memory for off-screen items. `numColumns={2}` splits items into two equal-width columns natively. Required Constitution VIII props (`getItemLayout`, `removeClippedSubviews`, `keyExtractor` as `useCallback`, `React.memo` on item) apply directly. `FlashList` from Shopify is a faster alternative but adds a dependency; overkill for ~16 static items.  
**Alternatives considered**:

- `ScrollView` wrapping two `View` columns — rejected because it renders all items at once with no virtualisation; unscalable when real data arrives later.
- `SectionList` — over-engineered for non-sectioned content; category filter is a client-side filter, not a section separator.
- `FlashList` (Shopify) — best-in-class performance, but adds a new dependency not already in `package.json`; `FlatList` is sufficient for ≤16 static items at 60 fps.

---

## Decision 2: Category Chip Row Implementation

**Decision**: `ScrollView` (horizontal) rendering chips via `.map()` over the `CATEGORIES` constant  
**Rationale**: The number of categories is fixed (~4–6), defined in static data. A `FlatList` for 6 items adds overhead without benefit. `ScrollView` horizontal + `map` is idiomatic React Native for short, fixed lists. `showsHorizontalScrollIndicator={false}` removes the scroll bar for a cleaner look.  
**Alternatives considered**:

- `FlatList` horizontal — rejected; unnecessary virtualisation overhead for a small, fully-known list.
- `contentContainerStyle` padded `ScrollView` — chosen approach; natural horizontal chip layout with `flexDirection: 'row'` and `gap`.

---

## Decision 3: Active Category Filter State Location

**Decision**: `useState<string>` (category slug / `'all'`) inside `useHome.ts` custom hook  
**Rationale**: The active category is purely UI-local state — it does not need to be shared across screens, persisted across sessions, or read by any other feature. `useState` directly in the screen-level hook is the minimum viable approach. `useMemo` derives the filtered product list from `PRODUCTS` and the active slug.  
**Alternatives considered**:

- Redux slice — rejected; over-engineered for transient UI-only state with no cross-screen sharing requirement. Constitution VI requires Redux for _cross-component application state_, which this is not.
- `useReducer` — unnecessary complexity for a single string selector.

---

## Decision 4: Pastel Color Palette Extension

**Decision**: Add named pastel keys (`pastelRose`, `pastelMint`, `pastelLavender`, `pastelPeach`, `pastelSky`, `pastelLemon`) to `themeColors` in `Colors.ts`; also add `cardBackground`, `chipActive`, `chipInactive`, `chipActiveText`, `chipInactiveText`, `ratingGold`, `imagePlaceholder` as semantic UI tokens.  
**Rationale**: Constitution II forbids any hardcoded hex values. New colors must be named keys in `Colors.ts`. Pastel palette values apply uniformly in both light and dark modes (pastel tones survive both backgrounds). Semantic UI token names (`chipActive`, `cardBackground`, etc.) make Constitution II compliance self-documenting — style files need never write `'#BFEFDF'` directly.  
**Alternatives considered**:

- Per-component color constants file — rejected; would fragment the color source of truth and violate Constitution II's intent.
- Extending only `light` theme with pastels — rejected; `dark` theme must also reference named tokens to avoid runtime crashes when theme toggles.

---

## Decision 5: Dummy Data Shape

**Decision**: Two `as const` arrays in `HomeData.ts`:

- `CATEGORIES`: `Array<{ id: string; name: string; slug: string }>` — first entry is the special "All" chip with `slug: 'all'`.
- `PRODUCTS`: `Array<{ id: string; title: string; price: number; rating: number; category: string; imageUrl: string }>` — `category` matches a `Category` slug; `imageUrl` uses Picsum seed URLs.  
  **Rationale**: Constitution X requires static data in a dedicated file with `as const`. Naming `CATEGORIES` and `PRODUCTS` in UPPER_CASE signals immutable constants per Constitution's file naming conventions. Separating `id` from the displayed fields makes it easy to exclude `id` from rendering without special-casing.  
  **Alternatives considered**:
- Inline arrays in `HomeScreen.tsx` — rejected; explicit Constitution X violation.
- Single merged data shape (product carries category name inline) — rejected; would duplicate category label strings across every product entry and violate Constitution V's "no raw string literals" intent.

---

## Decision 6: Product Image Strategy

**Decision**: `https://picsum.photos/seed/${product.id}/400/600` per product (4:3 portrait aspect ratio via 400×600)  
**Rationale**: Picsum provides stable, seed-deterministic images — the same `id` always yields the same image. 400×600 at render aspect ratio 2:3 fills a portrait card naturally. Constitution clarification answer (Q3) confirmed remote placeholder URLs.  
**Broken-image fallback**: `onError` callback on `Image` sets a local state flag; a `View` with `Colors[theme]?.imagePlaceholder` background renders in place.  
**Alternatives considered**:

- `unsplash.it` — deprecated.
- Locally bundled placeholder — rejected per clarification Q3 answer.
- `via.placeholder.com` — less stable than Picsum.

---

## Decision 7: Sub-Component Boundaries

**Decision**: Three sub-components — `HomeHeader`, `CategoryChip`, `ProductCard`  
**Rationale**:

- `HomeHeader` — renders the branded greeting; isolated so the greeting copy can be changed without touching `HomeScreen`. Receives no props (reads directly from `Strings`).
- `CategoryChip` — receives `category`, `isActive`, `onPress`; wrapped in `React.memo`. Single responsibility: pill button with active/inactive visual state.
- `ProductCard` — receives a `Product` item; wrapped in `React.memo`. Manages its own broken-image state internally.  
  **All three** follow the 4-file architecture per Constitution I.  
  **Alternatives considered**:
- Merging `HomeHeader` into `HomeScreen` — acceptable for a single-line header, but isolating it keeps `HomeScreen` rendering logic clean.
- Making chips a `FlatList` sub-item — rejected; `ScrollView` + map chosen (Decision 2), so no separate render function is needed.
