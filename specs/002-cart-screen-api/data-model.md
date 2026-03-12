# Data Model: Cart Screen and Item Controls

**Date**: 2026-03-12  
**Source**: [spec.md](./spec.md) + [research.md](./research.md)

---

## Entities

### CartRequestProductInput

Product quantity entry sent to the cart API.

```typescript
interface CartRequestProductInput {
  id: number;
  quantity: number;
}
```

**Validation rules**:

- `id` must be a positive numeric product identifier.
- `quantity` must be a positive integer for create and additive updates.
- Decrement and removal flows derive a full desired product list from the confirmed cart snapshot before submitting a replacement update.

---

### AddCartRequest

Request payload for `POST /carts/add`.

```typescript
interface AddCartRequest {
  userId: number;
  products: CartRequestProductInput[];
}
```

**Validation rules**:

- `userId` uses the application-provided dummy user id when sign-in is unavailable.
- `products` must contain at least one product.
- Each product id must appear at most once in the submitted payload.

---

### UpdateCartRequest

Request payload for `PUT /carts/{cartId}`.

```typescript
interface UpdateCartRequest {
  merge?: boolean;
  products: CartRequestProductInput[];
}
```

**Validation rules**:

- `merge: true` is reserved for additive updates that should include existing products.
- Replacement-style updates submit the full desired products array without additive merge semantics.
- `products` may be empty only when the app intentionally clears the last remaining cart line and the endpoint accepts an empty replacement list.

---

### RemoteCartProductResponse

Remote cart line item returned by DummyJSON cart endpoints.

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
- The discounted line amount may arrive as `discountedPrice` or `discountedTotal`; normalization must support both.
- `thumbnail` may be empty, but empty URLs must not break rendering.

---

### RemoteCartResponse

Successful top-level response from `POST /carts/add` and `PUT /carts/{cartId}`.

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
- `products` represents the server-confirmed cart lines and replaces the prior confirmed snapshot on success.
- `totalProducts` and `totalQuantity` are separate counts and must not be conflated.

---

### CartItem

Normalized cart line item used by Product Detail and the cart tab.

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
- `lineDiscountedTotal` is optional because the transport field name is inconsistent.
- Each `productId` may appear only once in a confirmed cart snapshot.

**Normalization rules**:

- Convert remote numeric `id` into string `productId`.
- Trim shopper-facing text fields before display.
- Map `discountedPrice ?? discountedTotal` into `lineDiscountedTotal`.
- Keep only the latest confirmed quantity for each product id.

---

### CartPricingSummary

Derived summary state for cart totals and pricing availability.

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

- `subtotal` comes from the remote cart `total`.
- `discountedSubtotal` comes from the remote cart `discountedTotal`.
- `discountAmount` is derived as `subtotal - discountedSubtotal` when both values are finite.
- `tax`, `shipping`, and `grandTotal` remain undefined when the backend does not provide enough confirmed pricing information.
- `pricingStatus` is `partial` whenever any required summary row is unavailable.

---

### CartSnapshot

The confirmed, persistable cart state used by the app.

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

- `cartId` is required after the first successful cart creation.
- `items` must match the latest confirmed API result when `source` is `api`.
- `source` is `local-fallback` only during hydration before a newer successful API response arrives.
- `apiUserId` is informational only and must not be used for cart restoration.

---

### CartState

Redux-owned cart state for persistence, hydration, and request lifecycle.

```typescript
interface CartState {
  snapshot?: CartSnapshot;
  isHydrated: boolean;
  isCartLoading: boolean;
  activeMutationProductIds: string[];
  cartErrorMessage?: string;
  lastFailedOperation?: 'hydrate' | 'create' | 'update';
}
```

**Validation rules**:

- `snapshot` represents only the latest confirmed cart state.
- `isHydrated` becomes true once persisted cart data has been evaluated.
- `activeMutationProductIds` tracks row- or detail-level controls that should be disabled while syncing.
- `cartErrorMessage` must not overwrite or discard the last confirmed snapshot.

**State transitions**:

```text
unhydrated
  → hydrate local persistence
ready-empty
  → add first product
creating-cart
  → create success
ready-with-items
  → increment/decrement/remove
updating-cart
  → update success
ready-with-items | ready-empty
  → request failure
error-with-last-confirmed-snapshot
```

---

### ProductDetailCartControlState

Derived UI state for the bottom action area on Product Detail.

```typescript
interface ProductDetailCartControlState {
  mode: 'add' | 'quantity';
  quantity: number;
  isMutating: boolean;
}
```

**Validation rules**:

- `mode` is `add` only when the selected product is absent from the confirmed cart snapshot.
- `mode` is `quantity` when the selected product has a confirmed quantity greater than `0`.
- `isMutating` is driven by the cart slice’s per-product mutation tracking.

---

## Relationships

- One `CartSnapshot` contains many `CartItem` records.
- One `CartPricingSummary` belongs to one `CartSnapshot`.
- One `CartState` owns zero or one confirmed `CartSnapshot`.
- `ProductDetailCartControlState` is derived from `CartState` + the active product id.

---

## Derived Display Rules

- The cart screen shows all API-returned cart item details available in `CartItem` plus cart-level counts and pricing data from `CartSnapshot`.
- The cart screen renders subtotal, tax, shipping, and grand total rows from `CartPricingSummary`; unavailable values remain explicitly unavailable instead of defaulting to `0`.
- Product Detail and the cart tab read the same `CartSnapshot`, so the latest confirmed quantity is always shared across both surfaces.
