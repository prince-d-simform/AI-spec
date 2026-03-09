# External API Contract: Product Categories

**Type**: Consumed HTTP API Contract  
**Date**: 2026-03-09  
**Feature**: `001-category-api-integration`

---

## Endpoint

- **Base URL source**: `AppEnvConst.apiUrl`
- **Base URL fallback**: `https://dummyjson.com`
- **Path**: `/products/categories`
- **Method**: `GET`
- **Auth**: None
- **Client**: Existing centralized API client path from `APIConfig.ts` using the shared base URL configuration

---

## Successful Response

**HTTP 200**

```json
[
  {
    "slug": "beauty",
    "name": "Beauty",
    "url": "https://dummyjson.com/products/category/beauty"
  }
]
```

### Response Schema

```typescript
interface RemoteCategoryRecord {
  slug: string;
  name?: string;
  url?: string;
}

type ProductCategoriesResponse = RemoteCategoryRecord[];
```

---

## Normalization Contract

The mobile app must normalize the raw response before rendering:

1. Ignore any entry without a usable `slug`.
2. Deduplicate categories by `slug`.
3. If `name` is missing or blank, derive a shopper-facing label from `slug`.
4. Prepend a synthetic `All` category to the normalized list.
5. Normalize category state to `slug` and `name` only.
6. Reset an invalid selected category to `all` when the refreshed normalized list no longer contains it.

Normalized UI shape:

```typescript
interface Category {
  slug: string;
  name: string;
}
```

Synthetic `All` contract:

```typescript
const ALL_CATEGORY: Category = {
  slug: 'all',
  name: Strings.Home.categoryAll
};
```

---

## Loading Contract

While the API request is in progress:

- The Home screen keeps the category row area visible.
- The row renders shimmer chip placeholders instead of loading text.
- Product grid rendering remains available.

---

## Failure Contract

If the API request fails and the rest of the catalog screen is available:

- The screen remains usable.
- The category row shows only the synthetic `All` option.
- A category-specific error message is displayed.
- A retry action is offered.

If the API returns no shopper-visible categories:

- The screen remains usable.
- The category row shows only the synthetic `All` option.
- No failure state is shown for the empty-but-successful response.

---

## Redux Contract

The `products` slice exposes category state to the Home module.

```typescript
interface ProductsState {
  categories: Category[];
  isLoading: boolean;
  error?: ErrorResponse;
  lastUpdated?: number;
}
```

Selectors required:

- `getProducts`
- `getCategories`
- `getLoading`
- `getError`

Async action required:

- `getProductCategoriesRequest`

---

## UI Contract Touchpoints

Consumer files:

- `app/modules/home/useHome.tsx`
- `app/modules/home/HomeScreen.tsx`
- `app/modules/home/sub-components/category-chip/CategoryChip.tsx`
- `app/modules/home/sub-components/category-chip-shimmer/*`

The Home module consumes normalized `Category[]`, not raw transport objects.
