# External API Contract: Cart Create and Update

**Type**: Consumed HTTP API Contract  
**Date**: 2026-03-12  
**Feature**: `002-cart-screen-api`

---

## Endpoints

### Create cart

- **Base URL source**: `AppEnvConst.apiUrl`
- **Path**: `/carts/add`
- **Method**: `POST`
- **Auth**: None
- **Client**: Existing centralized API client from `APIConfig.ts` via `createAsyncThunkWithCancelToken()` and `unauthorizedAPI`
- **Invocation timing**: Called only when the app has no confirmed `cartId` and the shopper adds the first item
- **Request owner**: New `cart` Redux slice

### Update cart

- **Base URL source**: `AppEnvConst.apiUrl`
- **Path template**: `/carts/{cartId}`
- **Method**: `PUT`
- **Auth**: None
- **Client**: Existing centralized API client from `APIConfig.ts` via `createAsyncThunkWithCancelToken()` and `unauthorizedAPI`
- **Invocation timing**: Called for cart quantity changes after a confirmed `cartId` exists
- **Path construction**: The thunk passes `paths: { cartId }` so the shared API layer resolves the final endpoint through the existing path formatter

---

## Create Request Contract

```json
{
  "userId": 1,
  "products": [
    {
      "id": 144,
      "quantity": 4
    },
    {
      "id": 98,
      "quantity": 1
    }
  ]
}
```

### Rules

1. `userId` is the application-provided dummy id used only to satisfy API request shape when no authenticated shopper id exists.
2. `products` must include at least one `{ id, quantity }` entry.
3. Each product id appears only once per request.
4. The first successful create response establishes the persisted `cartId` used for all future updates.

---

## Update Request Contract

### Additive update example

```json
{
  "merge": true,
  "products": [
    {
      "id": 1,
      "quantity": 1
    }
  ]
}
```

### Replacement update shape

```json
{
  "products": [
    {
      "id": 98,
      "quantity": 2
    },
    {
      "id": 144,
      "quantity": 1
    }
  ]
}
```

### Rules

1. Use `merge: true` when the intent is additive and existing products should be preserved automatically.
2. Use a replacement-style request body for decrement/remove flows so the confirmed cart can exactly match the app’s desired final line set.
3. The update endpoint returns the full updated cart envelope and replaces the prior confirmed cart snapshot on success.
4. The app must not depend on `userId` for update calls once a `cartId` exists.

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
      "quantity": 4,
      "total": 55999.96,
      "discountPercentage": 0.82,
      "discountedPrice": 55541,
      "thumbnail": "https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Submariner%20Watch/thumbnail.png"
    }
  ],
  "total": 56044.95,
  "discountedTotal": 55581,
  "userId": 1,
  "totalProducts": 2,
  "totalQuantity": 5
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

- Add/update examples return line-level `discountedPrice`.
- Other DummyJSON cart responses may use line-level `discountedTotal`.
- Normalization must accept either line-level discounted field name.

---

## Normalization Contract

The mobile app must normalize every successful create/update response before rendering or persisting it.

### Normalization rules

1. Convert numeric cart and product ids to stable string ids for Redux/UI selectors.
2. Preserve all shopper-relevant fields returned by the API.
3. Normalize `discountedPrice ?? discountedTotal` into one line-level discounted amount.
4. Derive a pricing summary with:
   - `subtotal` from remote `total`
   - `discountedSubtotal` from remote `discountedTotal`
   - `discountAmount` from `subtotal - discountedSubtotal`
5. Treat the successful API response as the canonical cart snapshot for both visible UI and persisted state.
6. Persist cart state independently from user id restoration.

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

- Cart subtotal-equivalent merchandise total: `total`
- Discounted merchandise total: `discountedTotal`
- Total line count: `totalProducts`
- Total unit count: `totalQuantity`
- Line totals and line discount metadata per product

### Unavailable values

The provided create/update contract does **not** confirm tax or shipping amounts.

### UI rule

- The cart screen must still render rows for subtotal, tax, shipping, and grand total.
- When tax/shipping/grand total are not confirmed by the latest API response, those rows must display a safe unavailable state instead of fabricated numeric values.

---

## Persistence Contract

1. Local persistence stores only the latest confirmed normalized cart snapshot plus hydration metadata.
2. On app launch, the UI may hydrate from the persisted cart snapshot.
3. After any successful create/update response, the API response replaces the persisted snapshot.
4. A persisted cart snapshot is never restored by looking up a stored user id.

---

## Failure Contract

### Generic failure

If create or update fails:

- Keep the last confirmed cart snapshot visible.
- Show a clear recovery/error message.
- Do not show unconfirmed quantity changes as final state.

### Local/API mismatch

If the persisted local cart differs from a newly successful API response:

- Replace the local cart snapshot with the successful API response.
- Do not merge conflicting quantities heuristically.

---

## UI Contract Touchpoints

Consumer files:

- `app/modules/details/useDetails.ts`
- `app/modules/details/DetailsScreen.tsx`
- `app/modules/cart/useCart.ts`
- `app/modules/cart/CartScreen.tsx`
- `app/redux/cart/CartSlice.ts`
- `app/redux/cart/CartSelector.ts`
