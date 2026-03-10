# Data Model: All Products Catalog Loading

**Date**: 2026-03-09  
**Source**: [spec.md](./spec.md) + [research.md](./research.md)

---

## Entities

### RemoteProductDimensions

Transport object describing package dimensions for a remote product.

```typescript
interface RemoteProductDimensions {
  width: number;
  height: number;
  depth: number;
}
```

**Validation rules**:

- All dimension values must be finite numbers.
- Missing or malformed dimensions do not block Home-card rendering, because dimensions are not currently shown in the grid.

---

### RemoteProductReview

Transport object describing one remote review entry.

```typescript
interface RemoteProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}
```

**Validation rules**:

- `rating` must be numeric.
- Other review fields are stored only as transport-safe strings and are not required for current grid rendering.

---

### RemoteProductMeta

Transport metadata returned for a remote product.

```typescript
interface RemoteProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}
```

**Validation rules**:

- All fields are string transport values.
- Invalid metadata does not block Home-card rendering.

---

### RemoteProductRecord

Raw product item returned by the `/products` endpoint.

```typescript
interface RemoteProductRecord {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: RemoteProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: RemoteProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: RemoteProductMeta;
  thumbnail: string;
  images: string[];
}
```

**Validation rules**:

- `id`, `title`, `category`, `price`, and `rating` are required to produce a valid Home-card record.
- `price` and `rating` must be finite numeric values because the existing card UI formats them with `toFixed()`.
- `category` must normalize to a non-empty slug string.
- `thumbnail` is preferred for grid rendering; `images[0]` is the fallback when available.
- Duplicate remote products are deduplicated by `id` before entering the visible catalog.

---

### RemoteProductsResponse

Top-level successful response for the all-products endpoint.

```typescript
interface RemoteProductsResponse {
  products: RemoteProductRecord[];
  total: number;
  skip: number;
  limit: number;
}
```

**Validation rules**:

- `products` must be an array.
- `total`, `skip`, and `limit` must be numeric metadata values.
- The loaded `products.length` should be validated against the response metadata to confirm the `All` view is complete.

---

### Product

Normalized Home-grid product consumed by the existing Home module.

```typescript
interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  category: string;
  imageUrl: string;
}
```

**Validation rules**:

- `id` is a stable string derived from the remote numeric identifier.
- `title` must be a non-empty shopper-facing name.
- `price` and `rating` must remain finite numbers.
- `category` must match the Home chip slug format used for filtering.
- `imageUrl` should use `thumbnail` first, then `images[0]`, else a placeholder-safe empty value.

**Normalization rules**:

- Convert `id` to `string` for FlatList key stability with existing UI types.
- Trim string fields before storing.
- Drop invalid remote records that cannot satisfy the Home product contract.
- Do not mutate the normalized list when category chips change.

---

### ProductsState

Extended Redux state owned by the existing `products` slice.

```typescript
interface ProductsStateType {
  categories: Category[];
  isLoading: boolean;
  error?: ErrorResponse;
  lastUpdated?: number;
  allProducts: Product[];
  isProductsLoading: boolean;
  isProductsRefreshing: boolean;
  productsError?: ErrorResponse;
  productsLastUpdated?: number;
  total?: number;
  skip?: number;
  limit?: number;
}
```

**Validation rules**:

- `categories` always contains at least the synthetic `All` category.
- `allProducts` is the canonical source dataset for the Home grid.
- `isProductsLoading` is used for the first all-products load when no prior catalog exists.
- `isProductsRefreshing` is used for pull-to-refresh after a prior successful load.
- `productsError` is populated on failed initial load or failed refresh, but a refresh failure does not clear `allProducts`.
- `productsLastUpdated` is set only after successful product fetch completion.
- `total`, `skip`, and `limit` reflect the latest successful `/products` response metadata.

**State transitions**:

```text
idle
  → getAllProducts.pending (no catalog yet)
initial-loading
  → getAllProducts.fulfilled with products
loaded
  → getAllProducts.fulfilled with empty products
empty
  → getAllProducts.rejected before first success
initial-failed

loaded
  → getAllProducts.pending (user pull-to-refresh)
refreshing
  → getAllProducts.fulfilled
loaded
  → getAllProducts.rejected
loaded-with-refresh-error
```

**Failure behavior**:

- Initial all-products failure leaves `allProducts` empty and surfaces blocking retry UI.
- Refresh failure preserves the last successful `allProducts` dataset and only updates refresh feedback.
- Category failure does not clear `allProducts`; the UI degrades to `All`-only browsing.

---

### ActiveCategoryFilter

Local UI state inside `useHome.tsx` representing the selected chip.

```typescript
type ActiveCategoryFilter = string;
```

**Rules**:

- Initial value is `'all'`.
- `all` returns the full `allProducts` dataset.
- Any other value filters locally against `Product.category`.
- If the selected slug disappears from the refreshed category list, the selection resets to `'all'`.

---

## Derived Data

### Visible Product Set

```typescript
const visibleProducts =
  activeCategory === 'all'
    ? allProducts
    : allProducts.filter((product) => product.category === activeCategory);
```

**Rules**:

- Derived in `useHome.tsx` with `useMemo`.
- Never persisted separately in Redux.
- Switching chips changes only this derived subset, not `allProducts`.
- Products whose categories are not represented by a chip remain visible in `All` and absent from unmatched chip views.

### Product Refresh Eligibility

```typescript
const canRefreshProducts = allProducts.length > 0 && !isProductsLoading;
```

**Rules**:

- Pull-to-refresh is enabled only when the screen already has a catalog to preserve.
- Retry remains available for initial failures.

---

## Relationships

- `RemoteProductsResponse.products` normalizes into `ProductsStateType.allProducts`.
- `ProductsStateType.allProducts` is the source dataset for the Home module’s `visibleProducts`.
- `ActiveCategoryFilter` must match one `Category.slug` from the current category list or default to `'all'`.
- `Product.category` values are matched against `Category.slug` values when filtering.
- Category availability and product availability are independent failure domains.

---

## Contract Notes

- Base URL source: `AppEnvConst.apiUrl`
- Endpoint: `/products`
- Method: `GET`
- Response payload is a wrapper object containing `products`, `total`, `skip`, and `limit`.
- The all-products request must retrieve the complete available catalog, not only the endpoint’s default paginated subset.
