# Data Model: Cart Quantity Controls

**Date**: 2026-03-12  
**Source**: [spec.md](./spec.md) + [research.md](./research.md)

---

## Entities

### CartQuantityMutationIntent

A local mutation instruction that describes the shopper's requested cart change before the API request is built.

```typescript
interface CartQuantityMutationIntent {
  productId: string;
  targetQuantity: number;
  mutationType: 'add' | 'increment' | 'decrement' | 'delete';
}
```

**Validation rules**:

- `productId` must resolve to a positive numeric product identifier.
- `targetQuantity` must be an integer greater than or equal to `0`.
- `mutationType` must align with the requested transition:
  - `add` and `increment` produce `targetQuantity >= 1`
  - `decrement` produces `targetQuantity >= 1`
  - `delete` produces `targetQuantity = 0`

---

### CartRequestProductInput

A single product line included in the outbound cart confirmation request.

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
- Deleted products must not appear in this payload.

---

### AddCartRequest

Request payload submitted to the cart confirmation endpoint.

```typescript
interface AddCartRequest {
  userId: number;
  products: CartRequestProductInput[];
}
```

**Validation rules**:

- `userId` uses the existing application-provided dummy id while sign-in remains out of scope.
- `products` represents the full desired confirmed cart contents after the current mutation.
- `products` may be empty only when the shopper removes the final remaining cart item and the backend accepts an empty cart payload for confirmation.
- Product ids must be unique within one request.

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

Successful top-level response returned by the cart confirmation endpoint.

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

Normalized cart line stored in Redux and consumed by Product Detail and Cart UI.

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
- Preserve only the latest confirmed quantity for each product.

---

### CartPricingSummary

Canonical pricing state stored with the confirmed cart snapshot.

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
- `tax`, `shipping`, and `grandTotal` remain optional because the backend may omit them.
- `pricingStatus` is `partial` whenever any of `tax`, `shipping`, or `grandTotal` is unavailable from the backend.

---

### CartDisplayPricingSummary

UI-facing pricing values consumed by the cart summary component.

```typescript
interface CartDisplayPricingSummary {
  subtotal: number;
  discountedSubtotal: number;
  discountAmount: number;
  tax: number;
  shipping: number;
  grandTotal: number;
  usesFallbackValues: boolean;
}
```

**Derivation rules**:

- `subtotal`, `discountedSubtotal`, and `discountAmount` come from canonical pricing.
- `tax = canonical.tax ?? 0`.
- `shipping = canonical.shipping ?? 0`.
- `grandTotal = canonical.grandTotal ?? discountedSubtotal + tax + shipping`.
- `usesFallbackValues` is `true` whenever any displayed value came from a fallback calculation instead of the API.

---

### CartSnapshot

The confirmed, persistable cart state shared across the app.

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

- `cartId` is required after the first successful cart confirmation.
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
  isCartMutationLocked: boolean;
  cartErrorMessage?: string;
  lastFailedOperation?: 'hydrate' | 'add' | 'increment' | 'decrement' | 'delete';
}
```

**Validation rules**:

- `snapshot` stores only the last confirmed cart state.
- `isHydrated` becomes true after persisted cart evaluation.
- `activeMutationProductIds` identifies which products should show loading state while the cart-wide confirmation is in flight.
- `isCartMutationLocked` prevents overlapping full-snapshot confirmations.
- `cartErrorMessage` must never replace or clear the last confirmed snapshot.

**State transitions**:

```text
unhydrated
  → hydrate local persistence
ready-empty
  → add first product
submitting-confirmation
  → success
ready-with-items
  → increment or decrement one item
submitting-confirmation
  → success
ready-with-items
  → delete one item
submitting-confirmation
  → success with remaining items
ready-with-items
  → delete final item
submitting-confirmation
  → success with empty cart
ready-empty
  → any mutation failure
error-with-last-confirmed-snapshot
```

---

### QuantityControlState

Derived UI state for Product Detail and Cart rows.

```typescript
interface QuantityControlState {
  mode: 'add' | 'quantity';
  quantity: number;
  decrementAction: 'minus' | 'delete';
  isMutating: boolean;
}
```

**Validation rules**:

- `mode` is `add` when the product is absent from the confirmed cart snapshot.
- `mode` is `quantity` when the product exists in the confirmed cart snapshot.
- `decrementAction` is `delete` only when confirmed quantity is exactly `1`.
- `isMutating` is driven by the shared cart mutation state.

---

### CartItemRowViewModel

UI-facing derived row data for the editable Cart screen.

```typescript
interface CartItemRowViewModel {
  productId: string;
  title: string;
  quantity: number;
  decrementAction: 'minus' | 'delete';
  unitPriceValue: string;
  lineTotalValue: string;
  discountedTotalValue?: string;
  discountValue: string;
  thumbnailUrl?: string;
  isMutating: boolean;
}
```

**Validation rules**:

- View-model formatting must be derived from `CartSnapshot`, not from unconfirmed local input.
- `decrementAction` must match the confirmed quantity.
- `isMutating` must disable row controls while confirmation is pending.

---

### CheckoutCallToActionState

UI state for the cart summary footer CTA.

```typescript
interface CheckoutCallToActionState {
  isVisible: boolean;
  isDisabled: boolean;
  label: string;
}
```

**Validation rules**:

- `isVisible` is true only when the confirmed cart contains items.
- `isDisabled` is true while a cart confirmation is in flight.
- `label` must come from centralized strings.
