# External API Contract: Category Products

**Type**: Consumed HTTP API Contract  
**Date**: 2026-03-10  
**Feature**: `001-category-wise-products`

---

## Endpoint

- **Base URL source**: `AppEnvConst.apiUrl`
- **Path template**: `/products/category/{slug}`
- **Method**: `GET`
- **Auth**: None
- **Client**: Existing centralized API client from `APIConfig.ts` via `createAsyncThunkWithCancelToken()` and `unauthorizedAPI`
- **Invocation timing**: Called every time the shopper taps a non-`All` category chip
- **Path construction**: The thunk passes `paths: { slug }` so the shared API layer resolves the final endpoint path through `formatString()`
- **Retry behavior**: A retry re-requests the currently selected category

---

## Successful Response

**HTTP 200**

```json
{
  "products": [
    {
      "id": 101,
      "title": "Smartphone X",
      "category": "smartphones",
      "price": 699,
      "rating": 4.7,
      "thumbnail": "...",
      "images": ["...", "..."]
    }
  ],
  "total": 24,
  "skip": 0,
  "limit": 24
}
```

### Response Schema

```typescript
interface RemoteCategoryProductsResponse {
  products: RemoteProductRecord[];
  total: number;
  skip: number;
  limit: number;
}
```

The feature reuses the existing `RemoteProductRecord` transport contract already established for product responses.

---

## Request Contract

### Example path resolution

```typescript
APIConst.productsByCategory = '/products/category/{slug}';

getCategoryProductsRequest({
  paths: { slug: 'smartphones' },
  shouldShowToast: false
});
```

### Rules

1. The request is valid only for non-`All` category chips.
2. `slug` must match the selected category chip identifier.
3. Every non-`All` chip tap triggers a fresh request, even if the same slug was loaded earlier.
4. If a newer category request starts, older in-flight requests must not be allowed to overwrite the final visible selected-category state.
5. Starting a new selected-category request clears the previous `productsByCategory` contents so stale category products are not shown during the next category load.

---

## Normalization Contract

The mobile app must normalize the raw category-products payload before rendering:

1. Read the wrapper object from `response.products`.
2. Deduplicate records by `id`.
3. Ignore records that cannot produce a valid Home product card.
4. Convert each valid record into the existing Home `Product` shape.
5. Prefer `thumbnail` for card rendering and fall back to `images[0]`.
6. Store the normalized list in the single Redux variable `productsByCategory`.
7. Replace the previous `productsByCategory` list only when the latest selected-category request succeeds.

Normalized UI shape:

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

---

## Loading Contract

### Selected-category load

- Triggered on every non-`All` category chip tap.
- The UI shows category-specific loading feedback while waiting for the selected category response.
- The final visible state must match the latest selected chip.

### Repeat tap load

- Triggered again even if the same category chip was already loaded earlier.
- A successful repeat request replaces the existing `productsByCategory` contents atomically.

---

## Failure Contract

### Selected-category failure

If the selected category request fails:

- `productsByCategory` is cleared.
- The Home screen shows an error state for the selected category.
- A retry action is available for the same category.
- The system must not keep showing a previous category’s products as though they belong to the newly selected category.

### Empty selected-category response

If the selected category returns no products:

- The Home screen shows a category-specific empty state.
- The result still belongs to the selected category.

---

## Redux Contract

The existing `products` slice owns selected-category product state.

```typescript
interface ProductsStateType {
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

Selectors required:

- `getProductsByCategory`
- `getSelectedCategorySlug`
- `getCategoryProductsLoading`
- `getCategoryProductsError`
- `getCategoryProductsLastUpdated`

Async actions required:

- `getCategoryProductsRequest`

---

## UI Contract Touchpoints

Consumer files:

- `app/modules/home/useHome.tsx`
- `app/modules/home/HomeScreen.tsx`
- `app/redux/products/ProductsInitial.ts`
- `app/redux/products/ProductsSelector.ts`
- `app/redux/products/ProductsSlice.ts`
- `app/constants/APIConst.ts`
- `app/constants/ToolkitAction.ts`

The Home module consumes normalized `Product[]`, not raw transport records.
