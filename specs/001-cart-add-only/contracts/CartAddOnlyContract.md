# External API Contract: Add-Only Cart Confirmation

**Type**: Consumed HTTP API Contract  
**Date**: 2026-03-12  
**Feature**: `001-cart-add-only`

---

## Endpoint

### Confirm cart contents

- **Base URL source**: `AppEnvConst.apiUrl`
- **Path**: `/carts/add`
- **Method**: `POST`
- **Auth**: None
- **Client**: Centralized API client from `app/configs/APIConfig.ts` via thunk-based cart requests
- **Invocation timing**:
  - Called when the shopper adds the first product and no confirmed cart exists yet
  - Called again when the shopper adds a different product later and the app must confirm the full desired cart contents
- **Request owner**: `app/redux/cart/CartSlice.ts`

### Removed behavior

- `cartUpdate` / `PUT /carts/{cartId}` is not part of this feature contract.
- Direct quantity edit and direct removal actions are outside the supported API contract for this feature.

---

## Request Contract

### Request shape

```json
{
  "userId": 1,
  "products": [
    {
      "id": 144,
      "quantity": 1
    },
    {
      "id": 98,
      "quantity": 2
    }
  ]
}
```

### Rules

1. `userId` is an application-provided dummy id used only to satisfy request shape while sign-in is unavailable.
2. `products` must include the full desired confirmed cart contents after the shopper's latest add action.
3. Each product id may appear only once in a request.
4. Quantities must be positive integers.
5. When the shopper adds another product later, the request must include previously confirmed products and their confirmed quantities plus the new product.
6. The app must not send unsupported direct edit or direct removal operations through a separate update contract.

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
      "quantity": 2,
      "total": 27999.98,
      "discountPercentage": 0.82,
      "discountedPrice": 27771,
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
  "total": 28044.97,
  "discountedTotal": 27815,
  "userId": 1,
  "totalProducts": 2,
  "totalQuantity": 3
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

---

## Normalization Contract

The app must normalize every successful add confirmation response before rendering or persisting it.

### Normalization rules

1. Convert numeric cart and product ids to stable string ids for Redux/UI selectors.
2. Preserve shopper-visible response fields required by Product Detail and Cart review UI.
3. Normalize `discountedPrice ?? discountedTotal` into one line-level discounted amount.
4. Derive pricing summary values from the confirmed response:
   - `subtotal` from remote `total`
   - `discountedSubtotal` from remote `discountedTotal`
   - `discountAmount` from `subtotal - discountedSubtotal`
5. Treat the successful response as the canonical cart snapshot for both visible UI and persisted state.
6. Persist cart state independently from user identity restoration.

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

## Pricing Contract

### Confirmed values from API

- Merchandise subtotal: `total`
- Discounted subtotal: `discountedTotal`
- Product line count: `totalProducts`
- Unit count: `totalQuantity`
- Line totals and line discount metadata per product

### Unavailable values

The add-only response does not guarantee tax, shipping, or grand total values.

### UI rule

- The cart review screen must still render subtotal, tax, shipping, and grand total rows.
- When tax, shipping, or grand total are unavailable, those rows must display an explicit unavailable state instead of fabricated numbers.

---

## Persistence Contract

1. Persist only the latest confirmed normalized cart snapshot plus hydration metadata.
2. On app launch, the UI may hydrate from the persisted snapshot.
3. After any successful add confirmation, the response replaces the previously persisted snapshot.
4. Cart restoration must not depend on a stored user id.

---

## Failure Contract

### Generic failure

If add confirmation fails:

- Keep the last confirmed cart snapshot visible.
- Show a clear recovery/error message.
- Do not display unconfirmed cart contents as final state.

### Local/API mismatch

If locally persisted data differs from a newly successful response:

- Replace the local cart snapshot with the successful response.
- Do not merge conflicting quantities heuristically.

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
