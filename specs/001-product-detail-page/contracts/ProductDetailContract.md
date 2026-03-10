# External API Contract: Product Detail

**Type**: Consumed HTTP API Contract  
**Date**: 2026-03-10  
**Feature**: `001-product-detail-page`

---

## Endpoint

- **Base URL source**: `AppEnvConst.apiUrl`
- **Path template**: `/products/{id}`
- **Method**: `GET`
- **Auth**: None
- **Client**: Existing centralized API client from `APIConfig.ts` via `createAsyncThunkWithCancelToken()` and `unauthorizedAPI`
- **Invocation timing**: Called every time the shopper opens a Product Detail page
- **Path construction**: The thunk passes `paths: { id }` so the shared API layer resolves the final endpoint through `formatString()`
- **Retry behavior**: Retry re-requests the currently selected product `id`

---

## Successful Response

**HTTP 200**

```json
{
  "id": 1,
  "title": "Essence Mascara Lash Princess",
  "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
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
```

### Response Schema

```typescript
interface RemoteProductDetailResponse extends RemoteProductRecord {
  message?: string;
}
```

The feature reuses the existing transport-field family already defined for remote products, but consumes one product object rather than a list wrapper.

---

## Request Contract

### Example path resolution

```typescript
APIConst.productDetail = '/products/{id}';

getProductDetailRequest({
  paths: { id: '1' },
  shouldShowToast: false
});
```

### Rules

1. The request is valid only when a non-empty product `id` is available.
2. The `id` must match the product selected from the source list.
3. Every Product Detail open triggers a fresh request for the selected `id`.
4. If a newer product-detail request starts, older in-flight requests must not be allowed to overwrite the final visible detail state.
5. The screen navigates immediately, but the detail body stays in a dedicated loading state until the full response resolves.

---

## Normalization Contract

The mobile app must normalize the raw product-detail payload before rendering:

1. Convert the remote numeric `id` into a stable string.
2. Trim shopper-facing string fields before display.
3. Filter empty image URLs and tag strings.
4. Preserve every major field that carries shopper value, including extended metadata when available.
5. Store the normalized result in the active product-detail state inside the existing `products` Redux slice.
6. Replace the previous active detail only when the latest product-detail request succeeds.

Normalized UI shape:

```typescript
interface ProductDetail {
  availabilityStatus: string;
  brand?: string;
  category: string;
  id: string;
  discountPercentage: number;
  dimensions: ProductDimensions;
  title: string;
  description: string;
  images: string[];
  meta: ProductMeta;
  minimumOrderQuantity: number;
  price: number;
  rating: number;
  returnPolicy: string;
  reviews: ProductReview[];
  shippingInformation: string;
  sku: string;
  stock: number;
  tags: string[];
  thumbnail: string;
  warrantyInformation: string;
  weight: number;
}
```

---

## Loading Contract

### Initial detail load

- Triggered every time the shopper opens the Product Detail page.
- Navigation occurs immediately.
- The Product Detail page shows a dedicated loading state until the full detail response arrives.
- The page must not render only the tapped summary product as if it were the full detail view.

### Repeat open

- Opening the same product again in the same session triggers a fresh request.
- The latest request is the only one allowed to win.

---

## Failure Contract

### Generic failure

If the selected product detail request fails for a generic request reason:

- No stale product detail content should be shown for a different product.
- The Product Detail page shows a clear failure state.
- Retry and back actions are available.

### Unavailable / not found

If the selected product is unavailable or not found:

- The Product Detail page shows a dedicated unavailable state.
- Retry and back actions are available.
- The UI must distinguish this from a transient request failure.

---

## Redux Contract

The existing `products` slice owns the active product-detail state.

```typescript
interface ProductDetailState {
  selectedProductId?: string;
  selectedProductDetail?: ProductDetail;
  isProductDetailLoading: boolean;
  productDetailError?: ErrorResponse;
  productDetailUnavailable?: boolean;
  productDetailLastUpdated?: number;
  productDetailRequestId?: string;
}
```

Selectors required:

- `getSelectedProductId`
- `getSelectedProductDetail`
- `getProductDetailLoading`
- `getProductDetailError`
- `getProductDetailUnavailable`
- `getProductDetailLastUpdated`

Async actions required:

- `getProductDetailRequest`
- `clearProductDetailState`

---

## UI Contract Touchpoints

Consumer files:

- `app/modules/home/useHome.tsx`
- `app/modules/home/sub-components/product-card/ProductCard.tsx`
- `app/modules/details/DetailsScreen.tsx`
- `app/modules/details/useDetails.ts`
- `app/redux/products/ProductsInitial.ts`
- `app/redux/products/ProductsSelector.ts`
- `app/redux/products/ProductsSlice.ts`
- `app/navigation/AppNavigation.tsx`
- `app/constants/APIConst.ts`
- `app/constants/ToolkitAction.ts`

The Product Detail page consumes normalized `ProductDetail`, not the Home summary `Product` contract.
