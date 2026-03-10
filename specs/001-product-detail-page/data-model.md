# Data Model: Product Detail Page

**Date**: 2026-03-10  
**Source**: [spec.md](./spec.md) + [research.md](./research.md)

---

## Entities

### ProductDetailRouteParams

Navigation payload used to open the Product Detail page.

```typescript
interface ProductDetailRouteParams {
  id: string;
}
```

**Validation rules**:

- `id` must be a non-empty product identifier derived from the tapped product card.
- `id` must remain stable across navigation, retry, and back/forward flows.
- The Product Detail page uses only `id` as the navigation contract; summary card data is not treated as full detail content.

---

### RemoteProductDetailResponse

Successful top-level response from `/products/{id}`.

```typescript
interface RemoteProductDetailResponse {
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
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
}
```

**Validation rules**:

- `id` must be numeric in the remote payload and converted to a stable string for UI state.
- Major shopper-facing fields should be normalized before entering screen state.
- Missing optional values such as `brand` must not break the page.
- The endpoint returns one product object, not a list wrapper.

---

### ProductReview

Normalized review item rendered on the Product Detail page.

```typescript
interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}
```

**Validation rules**:

- `rating` must remain numeric for display and any derived summary calculations.
- `comment` and reviewer identity fields should be trimmed before display.
- Reviews with unusable core content may be omitted from the rendered list.

---

### ProductDimensions

Normalized physical-dimension block used by the specifications section.

```typescript
interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}
```

**Validation rules**:

- Dimension values must remain finite numbers before display.
- If dimensions are missing or invalid, the specifications section should omit the affected rows.

---

### ProductMeta

Normalized metadata block for lower-priority product information.

```typescript
interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}
```

**Validation rules**:

- Metadata fields are optional for UI purposes even if present in the transport schema.
- Empty metadata values should not produce empty UI rows.

---

### ProductDetail

Normalized full-detail model used by the Details screen.

```typescript
interface ProductDetail {
  id: string;
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
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  thumbnail: string;
  images: string[];
}
```

**Validation rules**:

- `id` is a string for route and UI consistency.
- `title`, `description`, `category`, `sku`, and status-like fields should be trimmed.
- `images` should prefer non-empty URLs and preserve order for gallery rendering.
- The model should preserve every major endpoint field that is meaningful to shoppers.
- Missing optional fields should be omitted cleanly at render time rather than represented as broken placeholders.

**Normalization rules**:

- Convert `id` to `string`.
- Prefer `images` for gallery display and `thumbnail` as a fallback hero image.
- Filter empty tag strings and image URLs.
- Preserve review order from the API unless future product requirements demand sorting.

---

### ProductDetailViewState

Redux-owned detail-state lifecycle inside the existing `products` domain.

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

**Validation rules**:

- `selectedProductId` reflects the current Details route target.
- `selectedProductDetail` is present only after a successful load of the active product.
- `isProductDetailLoading` is true while the active product request is in flight.
- `productDetailError` represents generic request failure for the active product.
- `productDetailUnavailable` distinguishes not-found/unavailable outcomes from generic failures.
- `productDetailRequestId` is used to ignore stale responses.

**State transitions**:

```text
idle
  → open-details(id)
loading
  → fetchProductDetail.fulfilled
loaded
  → open-details(other-id)
loading
  → fetchProductDetail.rejected
failed
  → retry
loading
  → unavailable outcome
unavailable
```

**Failure behavior**:

- A generic request failure shows retry and back actions.
- An unavailable outcome shows dedicated unavailable messaging with retry and back actions.
- Starting a new detail request clears the previous active detail content so the page does not show the wrong product.

---

### DetailSectionVisibility

Derived UI structure controlling which detail sections render.

```typescript
interface DetailSectionVisibility {
  hasTags: boolean;
  hasBrand: boolean;
  hasFulfillmentInfo: boolean;
  hasSpecifications: boolean;
  hasReviews: boolean;
  hasMetadata: boolean;
}
```

**Rules**:

- `hasTags` is true only when at least one non-empty tag is available.
- `hasBrand` is true only when a normalized brand value exists.
- `hasFulfillmentInfo` covers shipping, warranty, return-policy, and minimum-order sections.
- `hasSpecifications` covers SKU, weight, and any valid dimensions.
- `hasReviews` is true only when at least one normalized review remains after filtering.
- `hasMetadata` is true only when barcode, QR code, or created/updated timestamps are present.

- Derived with memoization inside the details hook.
- Empty optional sections should be hidden instead of rendered with empty placeholders.
- The high-priority summary section should always render after a successful load.
