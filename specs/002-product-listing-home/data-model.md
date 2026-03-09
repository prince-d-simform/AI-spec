# Data Model: Product Listing Home Screen

**Date**: 2026-03-06  
**Source**: `specs/002-product-listing-home/spec.md` + `research.md`

---

## Entities

### Category

Represents a product grouping used for filtering. The first entry in the `CATEGORIES` array is always the "All" wildcard.

```typescript
interface Category {
  id: string; // unique identifier, e.g. 'cat-1'
  name: string; // display label, e.g. 'Electronics' — sourced from Strings.Home.*
  slug: string; // filter key used to match Product.category, e.g. 'electronics'
  // special value: 'all' → shows all products
}
```

**Validation rules**:

- `slug` values must be lowercase, hyphenated, URL-safe strings.
- The first entry MUST have `slug: 'all'`.
- All `slug` values across `CATEGORIES` must be unique.
- Every `product.category` value must match a `slug` in `CATEGORIES` (excluding `'all'`).

---

### Product

Represents a single item in the product catalog.

```typescript
interface Product {
  id: string; // unique identifier used as FlatList key and Picsum seed
  title: string; // display name — max 2 lines shown in card (truncated with ellipsis)
  price: number; // numeric price in display currency units (e.g., 29.99)
  rating: number; // star rating 1.0–5.0, shown as numeric + star icon
  category: string; // slug matching a Category.slug (never 'all')
  imageUrl: string; // remote placeholder URL — https://picsum.photos/seed/${id}/400/600
}
```

**Validation rules**:

- `price` ≥ 0. Products with `price = 0` show `$0.00` (not a blank or crash).
- `rating` is clamped to [1.0, 5.0] by convention in static data.
- `category` must match one of the non-'all' slugs in `CATEGORIES`.
- `imageUrl` must be a valid HTTPS URL; the fallback renders if the URL is unreachable.
- `title` is a non-empty string; cards truncate to 2 lines with ellipsis.

---

### ActiveCategoryFilter

Represents the currently selected filter state. This is a simple `string` value held in `useHome` via `useState`.

```typescript
type ActiveCategoryFilter = string; // a Category.slug value, default: 'all'
```

**State transitions**:

```
Initial: 'all'
         ↓ user taps chip with slug S
       slug S
         ↓ user taps 'all' chip
       'all'
```

---

## Static Data Shape

### CATEGORIES constant

```typescript
const CATEGORIES: readonly Category[] = [
  { id: 'cat-0', name: Strings.Home.categoryAll, slug: 'all' },
  { id: 'cat-1', name: Strings.Home.categoryElectronics, slug: 'electronics' },
  { id: 'cat-2', name: Strings.Home.categoryFashion, slug: 'fashion' },
  { id: 'cat-3', name: Strings.Home.categoryHome, slug: 'home-living' },
  { id: 'cat-4', name: Strings.Home.categoryBeauty, slug: 'beauty' },
  { id: 'cat-5', name: Strings.Home.categorySports, slug: 'sports' }
] as const;
```

### PRODUCTS constant (shape — 14 entries in implementation)

```typescript
const PRODUCTS: readonly Product[] = [
  // electronics  (3 items)
  {
    id: 'p-01',
    title: '...',
    price: 99.99,
    rating: 4.5,
    category: 'electronics',
    imageUrl: 'https://picsum.photos/seed/p-01/400/600'
  }
  // fashion      (3 items)
  // home-living  (2 items)
  // beauty       (3 items)
  // sports       (3 items)
  // ...
] as const;
```

---

## Derived State

```typescript
// Computed inside useHome via useMemo:
const filteredProducts: readonly Product[] = useMemo(
  () =>
    activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory),
  [activeCategory]
);
```

Empty-state condition: `filteredProducts.length === 0` → render empty-state message.

---

## Color Tokens — Pastel Palette Addition to Colors.ts

### New `themeColors` keys

| Key                | Hex (light + dark shared)              | Usage                                               |
| ------------------ | -------------------------------------- | --------------------------------------------------- |
| `pastelRose`       | `#FFD6D6`                              | Category chip accent / product card background tint |
| `pastelMint`       | `#C8F0DC`                              | Category chip accent                                |
| `pastelLavender`   | `#DDD6FF`                              | Category chip accent                                |
| `pastelPeach`      | `#FFE5CC`                              | Category chip accent                                |
| `pastelSky`        | `#CCE8FF`                              | Category chip accent                                |
| `pastelLemon`      | `#FFFACC`                              | Category chip accent                                |
| `cardBackground`   | light: `#FFFFFF` / dark: `#1E1E1E`     | Product card surface                                |
| `cardShadow`       | light: `#00000018` / dark: `#00000040` | Card shadow color                                   |
| `chipActive`       | `#141414` (primary)                    | Active chip background — references `primary`       |
| `chipInactive`     | light: `#F2F2F2` / dark: `#2A2A2A`     | Inactive chip background                            |
| `chipActiveText`   | `#FFFFFF` (white)                      | Active chip label                                   |
| `chipInactiveText` | `#7B7B7B` (gray)                       | Inactive chip label                                 |
| `ratingGold`       | `#F4C430`                              | Star rating icon fill                               |
| `imagePlaceholder` | light: `#E8E8E8` / dark: `#2D2D2D`     | Broken-image fallback background                    |
| `screenBackground` | light: `#F7F7F7` / dark: `#121212`     | Screen outer background                             |
| `headerSubtitle`   | `#7B7B7B` (gray)                       | Header subtitle text                                |

> `chipActive` and `chipActiveText` intentionally reuse existing `primary` and `white` tokens; they are listed as logical names only — the style file will reference `Colors[theme]?.primary` and `Colors[theme]?.white` directly.
