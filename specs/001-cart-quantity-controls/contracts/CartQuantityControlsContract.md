# External API Contract: Cart Quantity Controls

**Type**: Consumed HTTP API Contract  
**Date**: 2026-03-12  
**Feature**: `001-cart-quantity-controls`

---

## Endpoint

### Confirm cart contents after any quantity mutation

- **Base URL source**: `AppEnvConst.apiUrl`
- **Path**: `/carts/add`
- **Method**: `POST`
- **Auth**: None
- **Client**: Centralized API client from `app/configs/APIConfig.ts` via thunk-based cart requests
- **Invocation timing**:
  - Called when the shopper adds the first product
  - Called again when the shopper increments quantity
  - Called again when the shopper decrements quantity
  - Called again when the shopper deletes a product from a quantity of `1`
- **Request owner**: `app/redux/cart/CartSlice.ts`

### Removed behavior

- `cartUpdate` / `PUT /carts/{cartId}` is not part of this feature contract.
- No separate delete endpoint is introduced.
- Quantity `0` is not sent for removed products.

---

## Request Contract

### Request shape

```json
{
  "userId": 1,
  "products": [
    {
      "id": 98,
      "quantity": 3
    },
    {
      "id": 144,
      "quantity": 1
    }
  ]
}
```

### Rules

1. `userId` is the existing application-provided dummy id while sign-in remains out of scope.
2. `products` must include the full desired confirmed cart contents after the shopper's latest action.
3. Each product id may appear only once in a request.
4. Quantities must be positive integers.
5. When a shopper increments or decrements one product, the request must still include the unchanged confirmed lines for the rest of the cart.
6. When a shopper deletes a product, the request must omit that product entirely.
7. If the final remaining item is removed, the request must represent an empty confirmed cart according to the backend's accepted payload shape.

### Increment example

Starting confirmed cart:

```json
{
  "products": [
    { "id": 98, "quantity": 2 },
    { "id": 144, "quantity": 1 }
  ]
}
```

After incrementing product `98`:

```json
{
  "userId": 1,
  "products": [
    { "id": 98, "quantity": 3 },
    { "id": 144, "quantity": 1 }
  ]
}
```

### Delete example

Starting confirmed cart:

```json
{
  "products": [
    { "id": 98, "quantity": 2 },
    { "id": 144, "quantity": 1 }
  ]
}
```

After deleting product `144` from quantity `1`:

```json
{
  "userId": 1,
  "products": [{ "id": 98, "quantity": 2 }]
}
```

---

## Successful Response

### Envelope

```json
{
  "id": 51,
  "products": [
    {
      "id": 98,
      "title": "Rolex Submariner Watch",
      "price": 13999.99,
      "quantity": 3,
      "total": 41999.97,
      "discountPercentage": 0.82,
      "discountedPrice": 41657,
      "thumbnail": "https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Submariner%20Watch/thumbnail.png"
    },
    {
      "id": 144,
      "title": "Cricket Helmet",
      "price": 44.99,
      "quantity": 1,
      "total": 44.99,
      "discountPercentage": 3.1,
      "discountedPrice": 44,
      "thumbnail": "https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Helmet/thumbnail.png"
    }
  ],
  "total": 42044.96,
  "discountedTotal": 41701,
  "userId": 1,
  "totalProducts": 2,
  "totalQuantity": 4
}
```

### Response schema

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

### Notes

- The response becomes the full confirmed cart state for the app.
- Line-level discounted values may arrive as `discountedPrice` or `discountedTotal`; normalization must support both.
- The response does not guarantee explicit tax, shipping, or grand total fields.

---

## Normalization Contract

The app must normalize every successful confirmation response before rendering or persisting it.

### Normalization rules

1. Convert numeric cart and product ids to stable string ids for Redux/UI selectors.
2. Preserve shopper-visible fields required by Product Detail quantity controls and Cart rows.
3. Normalize `discountedPrice ?? discountedTotal` into one line-level discounted amount.
4. Derive canonical pricing values from the confirmed response:
   - `subtotal` from remote `total`
   - `discountedSubtotal` from remote `discountedTotal`
   - `discountAmount` from `subtotal - discountedSubtotal`
5. Keep `tax`, `shipping`, and `grandTotal` optional in canonical state when the backend omits them.
6. Treat the successful response as the canonical cart snapshot for both visible UI and persisted state.

### Normalized domain shape

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

---

## Display Pricing Contract

### Display fallback rules

When the API omits tax, shipping, or grand total:

- `displayTax = pricing.tax ?? 0`
- `displayShipping = pricing.shipping ?? 0`
- `displayGrandTotal = pricing.grandTotal ?? pricing.discountedSubtotal + displayTax + displayShipping`

### UI rule

- The cart summary must always render numeric values for subtotal, discounted subtotal, discount amount, tax, shipping, and grand total.
- Missing tax and shipping values display as `0`.
- Missing grand total is calculated from the confirmed merchandise total plus displayed tax and shipping values.
- These display fallbacks are UI-derived values and must not overwrite canonical API-confirmed pricing fields in persistence.

---

## Persistence Contract

1. Persist only the latest confirmed normalized cart snapshot plus hydration metadata.
2. On app launch, the UI may hydrate from the persisted snapshot.
3. After any successful quantity mutation, the response replaces the previously persisted snapshot.
4. Cart restoration must not depend on a stored user id.

---

## Failure Contract

### Generic failure

If cart confirmation fails:

- Keep the last confirmed cart snapshot visible.
- Show a clear recovery or error message.
- Do not display unconfirmed quantity changes as final state.
- Re-enable controls only after the failed request resolves.

### Overlapping request prevention

Because every request sends the full desired cart, the app must prevent concurrent conflicting confirmations.

- Only one cart confirmation may be in flight at a time.
- All relevant quantity controls and checkout CTA should respect the mutation lock while the request is pending.

---

## UI Contract Touchpoints

Consumer files expected to align with this contract:

- `app/constants/APIConst.ts`
- `app/constants/ToolkitAction.ts`
- `app/redux/cart/CartSlice.ts`
- `app/redux/cart/CartSelector.ts`
- `app/modules/details/useDetails.ts`
- `app/modules/details/DetailsScreen.tsx`
- `app/modules/cart/useCart.ts`
- `app/modules/cart/CartScreen.tsx`
- `app/modules/cart/sub-components/cart-item-row/*`
- `app/modules/cart/sub-components/cart-summary/*`
