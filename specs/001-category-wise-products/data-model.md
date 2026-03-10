# Data Model: Category-Wise Product Loading

**Date**: 2026-03-10  
**Source**: [spec.md](./spec.md) + [research.md](./research.md)

---

## Entities

### CategoryProductsRequestPath

Dynamic path input used to resolve the selected category endpoint.

```typescript
interface CategoryProductsRequestPath {
  slug: string;
}
```

**Validation rules**:

- `slug` must be a non-empty category identifier derived from the selected chip.
- `slug` must remain compatible with the path-template placeholder used by the shared API formatter.
- `all` is not a valid value for this request path because the `All` chip does not use the category-specific endpoint.

---

### RemoteCategoryProductsResponse

Successful top-level response from `/products/category/{slug}`.

```typescript
interface RemoteCategoryProductsResponse {
  products: RemoteProductRecord[];
  total: number;
  skip: number;
  limit: number;
}
```

**Validation rules**:

- `products` must be an array.
- `total`, `skip`, and `limit` must be numeric metadata values when provided.
- The response should be treated as transport data and normalized before entering Home UI state.

---

### Product

Normalized Home-grid product reused for selected-category browsing.

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
- `price` and `rating` must remain finite numbers because the card UI formats them.
- `category` must normalize to a non-empty slug.
- `imageUrl` should prefer `thumbnail`, fall back to `images[0]`, and otherwise allow a placeholder-safe empty value.

**Normalization rules**:

- Convert `id` to `string` for FlatList key stability.
- Trim string fields before storing.
- Deduplicate incoming products by `id`.
- Drop invalid remote records that cannot satisfy the Home product contract.

---

### ProductsByCategory

Single shared Redux variable holding the latest selected-category result set.

```typescript
type ProductsByCategory = Product[];
```

**Rules**:

- Contains only the latest successfully loaded selected-category products.
- Replaces the prior category result set when a newer selected-category request succeeds.
- Clears on selected-category request failure.
- Does not act as a cache keyed by category slug.

---

### SelectedCategoryProductsState

Extended Redux state owned by the existing `products` slice for category-wise product loading.

```typescript
interface ProductsStateType {
  categories: Category[];
  allProducts: Product[];
  productsByCategory: Product[];
  selectedCategorySlug?: string;
  isCategoryProductsLoading: boolean;
  categoryProductsError?: ErrorResponse;
  categoryProductsLastUpdated?: number;
  categoryProductsRequestId?: string;
  categoryProductsTotal?: number;
  categoryProductsSkip?: number;
  categoryProductsLimit?: number;
}
```

**Validation rules**:

- `productsByCategory` stores only the latest selected-category list.
- `selectedCategorySlug` reflects the active non-`All` chip that initiated the current category request lifecycle.
- `isCategoryProductsLoading` is true only while the currently selected category request is in flight.
- `categoryProductsError` reflects the outcome for the current selected category and clears on a new request start or successful completion.
- `categoryProductsRequestId` tracks the latest in-flight request identity so stale responses can be ignored.
- Category-specific request metadata reflects the latest successful selected-category response.
- Starting a new selected-category request clears `productsByCategory` immediately so the Home screen does not keep showing the previous category’s products during the next selected-category load.

**State transitions**:

```text
idle
  → getCategoryProducts.pending
category-loading
  → getCategoryProducts.fulfilled
category-loaded
  → getCategoryProducts.pending (new chip tap)
category-loading
  → getCategoryProducts.rejected
category-failed

category-loaded
  → getCategoryProducts.pending (different or repeated chip tap)
category-loading
  → getCategoryProducts.fulfilled
category-loaded
  → getCategoryProducts.rejected
category-failed
```

**Failure behavior**:

- Selected-category failure clears `productsByCategory`.
- Selected-category failure does not relabel previous category results as the new category.
- Returning to `All` exits category-specific browsing and restores the non-category-specific source dataset.

---

### Visible Product Set

Derived Home-screen list based on the active chip.

```typescript
const visibleProducts = activeCategory === 'all' ? allProducts : productsByCategory;
```

**Rules**:

- Derived in `useHome.tsx` with memoization.
- `All` continues to use the full-catalog dataset.
- Any non-`All` chip uses the latest selected-category result set.
- The visible category list must correspond to the latest selected category only.
