# Data Model: Product Category Data Integration

**Date**: 2026-03-09  
**Source**: [spec.md](./spec.md) + [research.md](./research.md)

---

## Entities

### RemoteCategoryRecord

Raw category item returned by the DummyJSON endpoint.

```typescript
interface RemoteCategoryRecord {
  slug: string;
  name?: string;
  url?: string;
}
```

**Validation rules**:

- `slug` is required and must be a non-empty, lowercase, URL-safe string.
- `name` is optional at transport level; when missing or blank, the app derives a shopper-facing label from `slug`.
- `url` may be present in the transport payload but is not retained in normalized UI state.
- Duplicate records with the same `slug` are deduplicated during normalization.

---

### Category

Normalized category option consumed by the Home module.

```typescript
interface Category {
  slug: string;
  name: string;
}
```

**Validation rules**:

- `slug` must be unique within the visible category list.
- `name` must be a non-empty shopper-facing label.
- The synthetic `All` category is always present with `slug: 'all'`.

**Normalization rules**:

- The app prepends a synthetic `All` category before remote categories.
- `slug` is the only identifier used for rendering keys, filtering, and future API calls.
- If `name` is blank or missing, the app formats `slug` into title case for display.
- Remote duplicates are collapsed to the first valid record for a given `slug`.
- The normalized UI model does not keep `id` or `url`.

---

### AllCategoryOption

System-provided category option representing the complete catalog.

```typescript
const ALL_CATEGORY: Category = {
  slug: 'all',
  name: Strings.Home.categoryAll
};
```

**Rules**:

- Always present, regardless of network state.
- Rendered first in the category row.
- Used as the fallback selection when a prior category becomes invalid.

---

### ProductsState

Redux state for product-domain category loading.

```typescript
interface ProductsState {
  categories: Category[];
  isLoading: boolean;
  error?: ErrorResponse;
  lastUpdated?: number;
}
```

**Validation rules**:

- `categories` always contains at least `ALL_CATEGORY`, even for empty or failed category fetches.
- `isLoading` is `true` only during an active category fetch.
- `error` is defined only when the latest category fetch fails.
- `lastUpdated` is set only on successful fetch completion.

**State transitions**:

```text
idle
  → fetchCategories.pending
loading
  → fetchCategories.fulfilled
loaded
  → fetchCategories.rejected
failed
  → fetchCategories.pending
loading
```

**Failure behavior**:

- On failed fetch with the rest of the screen available, `categories` falls back to `[ALL_CATEGORY]` and `error` is populated.
- On empty successful fetches, `categories` resolves to `[ALL_CATEGORY]` without populating `error`.

---

### ActiveCategoryFilter

Local UI state in `useHome.tsx` representing the selected chip.

```typescript
type ActiveCategoryFilter = string;
```

**Rules**:

- Initial value is `'all'`.
- If the selected slug is missing from the refreshed normalized category list, the hook resets it to `'all'`.
- The selected slug is never allowed to remain on a removed category.

**State transitions**:

```text
Initial: 'all'
  → user taps remote category
selected-category-slug
  → user taps 'all'
'all'
  → refreshed category list no longer contains selected slug
'all'
```

---

## Derived Data

### Visible Category List

```typescript
const visibleCategories: Category[] = [ALL_CATEGORY, ...dedupedRemoteCategories];
```

**Rules**:

- The list always starts with `All`.
- Remote duplicates are removed by `slug`.
- Invalid remote items without a usable `slug` are excluded.
- React rendering keys should use `category.slug`.

### Home Filtered Products

```typescript
const filteredProducts =
  activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((product) => product.category === activeCategory);
```

**Rules**:

- Existing local `PRODUCTS` data remains the source for product cards in this feature.
- Categories from DummyJSON that do not map to local products legitimately produce the existing empty state.

---

## Relationships

- `ProductsState.categories` provides the normalized category dataset for the Home screen.
- `ActiveCategoryFilter` must match one `Category.slug` from the normalized list or default to `'all'`.
- `Product.category` values in local Home data are matched against `Category.slug` values when filtering.

---

## Contract Notes

- Base URL source: `AppEnvConst.apiUrl` with fallback `https://dummyjson.com`
- Endpoint: `/products/categories`
- Expected 200 response shape:

```json
[
  {
    "slug": "beauty",
    "name": "Beauty",
    "url": "https://dummyjson.com/products/category/beauty"
  }
]
```
