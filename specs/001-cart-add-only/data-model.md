# Data Model: Add-Only Cart Flow

**Date**: 2026-03-12  
**Source**: [spec.md](./spec.md) + [research.md](./research.md)

---

## Entities

### CartRequestProductInput

A single product entry included in an add-only cart confirmation request.

```typescript
interface CartRequestProductInput {
  id: number;
  quantity: number;
}
```

**Validation rules**:

- `id` must be a positive numeric product identifier.
- `quantity` must be a positive integer.
- Each product id may appear only once in a submitted request.

---

### AddCartRequest

Request payload submitted to the add-only cart endpoint.

```typescript
interface AddCartRequest {
  userId: number;
  products: CartRequestProductInput[];
}
```

**Validation rules**:

- `userId` uses the application-provided dummy id only to satisfy request shape when sign-in is unavailable.
- `products` must contain at least one entry.
- Every submission represents the full desired confirmed cart contents after the shopper's latest add action.
- Existing confirmed items must remain in the payload when a shopper adds another product later.

---

### RemoteCartProductResponse

A product line returned by the confirmed cart response.

```typescript
interface RemoteCartProductResponse {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice?: number;
  discountedTotal?: number;
  thumbnail: string;
}
```

**Validation rules**:

- `id`, `price`, `quantity`, `total`, and `discountPercentage` must be numeric.
- The discounted line amount may arrive as `discountedPrice` or `discountedTotal`; normalization must accept either field.
- `thumbnail` may be empty, but empty values must not break rendering.

---

### RemoteCartResponse

Successful top-level response returned by the add-only cart endpoint.

```typescript
interface RemoteCartResponse {
  id: number;
  products: RemoteCartProductResponse[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}
```

**Validation rules**:

- `id` must be a positive numeric cart identifier.
- `products` becomes the full confirmed cart line set on success.
- `totalProducts` and `totalQuantity` must be preserved as separate confirmed counts.

---

### CartItem

Normalized cart line stored in Redux and consumed by Product Detail and Cart review UI.

```typescript
interface CartItem {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  discountPercentage: number;
  lineDiscountedTotal?: number;
  thumbnailUrl?: string;
}
```

**Validation rules**:

- `productId` is stored as a string for selector and route consistency.
- `quantity` must remain a positive integer in the confirmed snapshot.
- Each `productId` may appear only once in a confirmed cart snapshot.

**Normalization rules**:

- Convert numeric product ids to string `productId` values.
- Map `discountedPrice ?? discountedTotal` into `lineDiscountedTotal`.
- Trim shopper-facing text before display.
- Preserve only the latest confirmed quantity for each product.

---

### CartPricingSummary

Derived pricing state for the cart review screen.

```typescript
interface CartPricingSummary {
  subtotal: number;
  discountedSubtotal: number;
  discountAmount: number;
  tax?: number;
  shipping?: number;
  grandTotal?: number;
  pricingStatus: 'complete' | 'partial';
}
```

**Validation rules**:

- `subtotal` comes from confirmed remote `total`.
- `discountedSubtotal` comes from confirmed remote `discountedTotal`.
- `discountAmount` is derived from `subtotal - discountedSubtotal` when both are finite.
- `tax`, `shipping`, and `grandTotal` remain undefined when the backend does not confirm them.
- `pricingStatus` is `partial` whenever one or more displayed summary values are unavailable.

---

### CartSnapshot

The confirmed, persistable cart state used across the app.

```typescript
interface CartSnapshot {
  cartId: string;
  apiUserId?: number;
  items: CartItem[];
  totalProducts: number;
  totalQuantity: number;
  pricing: CartPricingSummary;
  lastSyncedAt: number;
  source: 'api' | 'local-fallback';
}
```

**Validation rules**:

- `cartId` is required after the first successful add confirmation.
- `items` must match the latest confirmed response when `source` is `api`.
- `source` becomes `local-fallback` only during hydration before a newer success arrives.
- `apiUserId` is informational only and must not be used for restoration.

---

### CartState

Redux-owned cart state for hydration, request lifecycle, and recovery messaging.

```typescript
interface CartState {
  snapshot?: CartSnapshot;
  isHydrated: boolean;
  isCartLoading: boolean;
  activeMutationProductIds: string[];
  cartErrorMessage?: string;
  lastFailedOperation?: 'hydrate' | 'add';
}
```

**Validation rules**:

- `snapshot` stores only the last confirmed cart state.
- `isHydrated` becomes true after persisted cart evaluation.
- `activeMutationProductIds` identifies add actions that should be guarded while a confirmation is in flight.
- `cartErrorMessage` must never replace or clear the last confirmed snapshot.

**State transitions**:

```text
unhydrated
  → hydrate local persistence
ready-empty
  → add first product
submitting-add-only-cart
  → add success
ready-with-items
  → add another product
submitting-add-only-cart
  → add success
ready-with-items
  → add failure
error-with-last-confirmed-snapshot
```

---

### ProductDetailCartState

Derived UI state for the purchase area on Product Detail.

```typescript
interface ProductDetailCartState {
  mode: 'add' | 'added';
  quantity: number;
  isMutating: boolean;
}
```

**Validation rules**:

- `mode` is `add` when the selected product is absent from the confirmed cart snapshot.
- `mode` is `added` when the selected product exists in the confirmed cart snapshot.
- `quantity` reflects the latest confirmed quantity, even though quantity editing is not exposed.
- `isMutating` is driven by per-product add confirmation tracking.

---

### CartReviewItemViewModel

UI-facing derived row data for the read-only Cart screen.

```typescript
interface CartReviewItemViewModel {
  productId: string;
  title: string;
  productIdValue: string;
  quantityLabel: string;
  unitPriceValue: string;
  lineTotalValue: string;
  discountedTotalValue?: string;
  thumbnailUrl?: string;
}
```

**Validation rules**:

- View-model formatting must be derived from `CartSnapshot`, not from unconfirmed local input.
- Quantity is displayed as informational text only.
- Unavailable discounted values remain optional.
