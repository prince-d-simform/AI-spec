# External API Contract: Products Catalog

**Type**: Consumed HTTP API Contract  
**Date**: 2026-03-09  
**Feature**: `001-all-products-api`

---

## Endpoint

- **Base URL source**: `AppEnvConst.apiUrl`
- **Path**: `/products`
- **Method**: `GET`
- **Auth**: None
- **Client**: Existing centralized API client from `APIConfig.ts` via `createAsyncThunkWithCancelToken()` and `unauthorizedAPI`
- **Invocation timing**: Called when the Home screen loads and no successful all-products catalog exists in the current in-memory session
- **Refresh behavior**: Called again only through explicit retry or pull-to-refresh

---

## Successful Response

**HTTP 200**

```json
{
  "products": [
    {
      "id": 1,
      "title": "Essence Mascara Lash Princess",
      "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
      "category": "beauty",
      "price": 9.99,
      "discountPercentage": 7.17,
      "rating": 4.94,
      "stock": 5,
      "tags": ["beauty", "mascara"],
      "brand": "Essence",
      "sku": "RCH45Q1A",
      "weight": 2,
      "dimensions": {
        "width": 23.17,
        "height": 14.43,
        "depth": 28.01
      },
      "warrantyInformation": "1 month warranty",
      "shippingInformation": "Ships in 1 month",
      "availabilityStatus": "Low Stock",
      "reviews": [
        {
          "rating": 2,
          "comment": "Very unhappy with my purchase!",
          "date": "2024-05-23T08:56:21.618Z",
          "reviewerName": "John Doe",
          "reviewerEmail": "john.doe@x.dummyjson.com"
        }
      ],
      "returnPolicy": "30 days return policy",
      "minimumOrderQuantity": 24,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.618Z",
        "updatedAt": "2024-05-23T08:56:21.618Z",
        "barcode": "9164035109868",
        "qrCode": "..."
      },
      "thumbnail": "...",
      "images": ["...", "...", "..."]
    }
  ],
  "total": 194,
  "skip": 0,
  "limit": 194
}
```

### Response Schema

```typescript
interface RemoteProductDimensions {
  width: number;
  height: number;
  depth: number;
}

interface RemoteProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface RemoteProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

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

interface RemoteProductsResponse {
  products: RemoteProductRecord[];
  total: number;
  skip: number;
  limit: number;
}
```

---

## Normalization Contract

The mobile app must normalize the raw `/products` payload before rendering:

1. Read the wrapper object from `response.products`.
2. Deduplicate records by `id`.
3. Ignore records that cannot produce a valid Home product card.
4. Convert each valid record into the existing Home `Product` shape.
5. Prefer `thumbnail` for card rendering and fall back to `images[0]`.
6. Keep the normalized `allProducts` list as the canonical source dataset for the Home screen.
7. Use the response metadata to verify that the `All` view represents the complete fetched catalog.

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

### Initial load

- Triggered when the Home screen loads and no successful `allProducts` dataset exists yet.
- The UI shows product-loading feedback while waiting for the first successful catalog response.
- The `All` chip remains the default selection.

### Refresh load

- Triggered only through explicit retry after failure or pull-to-refresh after a prior success.
- A successful refresh replaces the stored `allProducts` dataset atomically.
- Refreshing does not mutate the visible catalog until the new response succeeds.

---

## Failure Contract

### Initial failure

If the first `/products` request fails before any catalog is available:

- The Home screen shows a product-specific failure state.
- A retry action is available.
- No stale catalog is shown because none exists yet.

### Refresh failure

If a later `/products` refresh fails after a prior success:

- The previously stored `allProducts` dataset remains visible.
- The shopper receives refresh failure feedback.
- Category switching continues to use the preserved catalog.

### Category-independent browsing

If `/products` succeeds but category chips fail:

- The Home screen remains browseable.
- The chip row degrades to an `All`-only state.
- The normalized all-products catalog remains visible.

---

## Redux Contract

The existing `products` slice owns the all-products state.

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

Selectors required:

- `getProducts`
- `getCategories`
- `getLoading`
- `getError`
- `getAllProducts`
- `getProductsLoading`
- `getProductsRefreshing`
- `getProductsError`

Async actions required:

- `getProductCategoriesRequest`
- `getAllProductsRequest`

---

## UI Contract Touchpoints

Consumer files:

- `app/modules/home/useHome.tsx`
- `app/modules/home/HomeScreen.tsx`
- `app/modules/home/sub-components/product-card/ProductCard.tsx`
- `app/redux/products/ProductsSlice.ts`
- `app/redux/products/ProductsSelector.ts`

The Home module consumes normalized `Product[]`, not raw transport records.
