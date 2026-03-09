# Quickstart: Product Listing Home Screen

**Feature**: `002-product-listing-home`  
**Date**: 2026-03-06

---

## Overview

This feature replaces the existing placeholder `HomeScreen` with a full product listing screen: a branded header, a horizontal category chip filter row, and a two-column product grid, all driven by static dummy data.

---

## Files to Touch

| Action  | File                                              | What changes                                        |
| ------- | ------------------------------------------------- | --------------------------------------------------- |
| MODIFY  | `app/theme/Colors.ts`                             | Add pastel + semantic UI color keys (15 new keys)   |
| MODIFY  | `app/translations/en.json`                        | Add new strings under `"home"` namespace            |
| MODIFY  | `app/constants/Strings.ts`                        | Extend `Home` frozen object with new string keys    |
| REPLACE | `app/modules/home/HomeScreen.tsx`                 | Full product listing screen                         |
| REPLACE | `app/modules/home/HomeStyles.ts`                  | Screen-level styles                                 |
| CREATE  | `app/modules/home/HomeTypes.ts`                   | `Category`, `Product`, `ActiveCategoryFilter` types |
| CREATE  | `app/modules/home/useHome.ts`                     | Hook: filter state + memoised derived list          |
| CREATE  | `app/modules/home/HomeData.ts`                    | `CATEGORIES` + `PRODUCTS` static dummy data         |
| MODIFY  | `app/modules/home/index.ts`                       | Ensure all exports are barelled                     |
| CREATE  | `app/modules/home/sub-components/index.ts`        | Sub-component barrel                                |
| CREATE  | `app/modules/home/sub-components/home-header/*`   | 4-file component                                    |
| CREATE  | `app/modules/home/sub-components/category-chip/*` | 4-file component                                    |
| CREATE  | `app/modules/home/sub-components/product-card/*`  | 4-file component                                    |

---

## Step-by-Step Implementation Order

### Step 1 — Extend Colors.ts

Add pastel and semantic UI tokens to `themeColors`, `light`, and `dark` objects. This must come first because all styles depend on it.

New keys: `pastelRose`, `pastelMint`, `pastelLavender`, `pastelPeach`, `pastelSky`, `pastelLemon`, `cardBackground`, `cardShadow`, `chipInactive`, `chipInactiveText`, `ratingGold`, `imagePlaceholder`, `screenBackground`, `headerSubtitle`.

> `chipActive` / `chipActiveText` reuse existing `primary` / `white` — no new keys needed.

### Step 2 — Add Strings

Add to `app/translations/en.json` under `"home"`:

```json
"discoverProducts": "Discover Products",
"findSomething": "Find something you love",
"categoryAll": "All",
"categoryElectronics": "Electronics",
"categoryFashion": "Fashion",
"categoryHome": "Home & Living",
"categoryBeauty": "Beauty",
"categorySports": "Sports",
"emptyState": "No products in this category",
"pricePrefix": "$"
```

Then expose them in `Strings.Home` in `Strings.ts`.

### Step 3 — Create Types (HomeTypes.ts)

Define `Category`, `Product`, and `ActiveCategoryFilter` types. These are referenced by both `HomeData.ts` and the components.

### Step 4 — Create Static Data (HomeData.ts)

Define `CATEGORIES` (6 entries inc. "All") and `PRODUCTS` (14 entries across 5 categories) as `as const` arrays. Use `Strings.Home.*` for all `name` values.

### Step 5 — Build Sub-Components (leaf → parent order)

1. `HomeHeader` — no props, renders greeting strings
2. `CategoryChip` — `{ category, isActive, onPress }`, `React.memo`
3. `ProductCard` — `{ product }`, `React.memo`, handles broken-image state internally

### Step 6 — Create useHome Hook

Holds `activeCategory` state, exports `filteredProducts` (memoised), `handleCategoryPress` (useCallback), `renderProductItem` (useCallback), `keyExtractor` (useCallback).

### Step 7 — Replace HomeScreen + HomeStyles

Compose all sub-components. Layout:

```
SafeAreaView (flex: 1, screenBackground)
├── HomeHeader
├── ScrollView horizontal (chips row, paddingVertical, paddingHorizontal)
│   └── CATEGORIES.map → CategoryChip
└── FlatList numColumns={2}
    ├── renderItem → renderProductItem (from useHome)
    ├── keyExtractor → keyExtractor (from useHome)
    ├── ListEmptyComponent → empty-state Text
    ├── removeClippedSubviews
    └── contentContainerStyle (padding, columnWrapperStyle gap)
```

### Step 8 — Update Barrel Exports

`app/modules/home/index.ts` and `app/modules/home/sub-components/index.ts`.

---

## Run & Verify

```bash
# Start Metro
yarn ios:dev   # or yarn android:dev

# Quality gates
yarn lint
yarn types     # tsc --noEmit — must be zero errors
yarn spelling
```

**Manual checks**:

1. Launch app → Home screen shows header + 5 category chips + 14 products in 2 columns
2. Tap "Electronics" chip → grid shows only electronics products; chip highlighted
3. Tap "All" chip → all products restored
4. Tap a category with hypothetically 0 matches → empty-state message appears
5. Toggle theme → all pastel colors, chip states, and card backgrounds adapt correctly
6. Scroll down → chip row stays visible at top (sticky)

---

## Key Constraints Reminder

- **No hardcoded hex** — all colours from `Colors[theme]?.keyName`
- **No raw dimensions** — all sizing via `scale()`
- **No inline strings** — all copy from `Strings.Home.*`
- **No inline static arrays** — data only from `HomeData.ts` constants
- **`React.memo`** on `ProductCard` and `CategoryChip`
- **`useCallback`** on `handleCategoryPress`, `renderProductItem`, `keyExtractor`
- **`useMemo`** on `filteredProducts`
