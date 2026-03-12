# Quickstart: Cart Screen and Item Controls

**Feature**: `002-cart-screen-api`  
**Date**: 2026-03-12

---

## Overview

This feature turns the placeholder cart tab into a real cart experience and adds Product Detail cart controls backed by DummyJSON cart APIs.

- Create endpoint: `POST /carts/add`
- Update endpoint: `PUT /carts/{cartId}`
- Initial add behavior: create a cart if no confirmed `cartId` exists
- Persistence strategy: persist the latest confirmed cart snapshot locally through Redux/MMKV
- Sync rule: latest successful API response replaces visible cart state and persisted cart state
- Product Detail behavior: bottom action switches between Add to Cart and quantity controls
- Cart screen behavior: show all returned cart details, row-level quantity controls, empty state, and pricing summary rows
- Pricing fallback: tax, shipping, and grand total rows stay explicit but may show unavailable values when the API does not supply them

---

## Files to Touch

| Action | File                                                                 | What changes                                                                             |
| ------ | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| MODIFY | `app/constants/APIConst.ts`                                          | Add `cartAdd` and `cartUpdate` endpoints                                                 |
| MODIFY | `app/constants/ToolkitAction.ts`                                     | Add cart thunk action names                                                              |
| MODIFY | `app/constants/Strings.ts`                                           | Expose cart screen, quantity control, summary, and sync-state strings                    |
| MODIFY | `app/translations/en.json`                                           | Add cart and detail action copy                                                          |
| MODIFY | `app/constants/MMKVKeys.ts`                                          | Add any explicit cart-related persistence keys if needed                                 |
| ADD    | `app/types/CartResponse.ts`                                          | Add typed cart API transport contracts                                                   |
| MODIFY | `app/types/index.ts`                                                 | Re-export cart transport types                                                           |
| MODIFY | `app/redux/Store.ts`                                                 | Register `cart` reducer and extend persist whitelist with `cart`                         |
| MODIFY | `app/redux/index.ts`                                                 | Export cart actions, selectors, and reducer entry points                                 |
| ADD    | `app/redux/cart/CartInitial.ts`                                      | Add cart state shape and initial state                                                   |
| ADD    | `app/redux/cart/CartSelector.ts`                                     | Add cart selectors for Product Detail and cart screen                                    |
| ADD    | `app/redux/cart/CartSlice.ts`                                        | Add cart thunks, normalization, reducers, and mutation tracking                          |
| ADD    | `app/redux/cart/index.ts`                                            | Re-export cart domain API                                                                |
| MODIFY | `app/modules/details/DetailsScreen.tsx`                              | Render the bottom cart action area                                                       |
| MODIFY | `app/modules/details/DetailsStyles.ts`                               | Add themed styles for the sticky/bottom cart controls                                    |
| MODIFY | `app/modules/details/DetailsTypes.ts`                                | Add cart control view-model typing if needed                                             |
| MODIFY | `app/modules/details/useDetails.ts`                                  | Read cart selectors and dispatch add/increment/decrement actions                         |
| MODIFY | `app/modules/cart/CartScreen.tsx`                                    | Replace placeholder landing screen with real cart experience                             |
| MODIFY | `app/modules/cart/CartStyles.ts`                                     | Add themed cart layout styles                                                            |
| MODIFY | `app/modules/cart/CartTypes.ts`                                      | Replace placeholder types with real cart screen contracts                                |
| ADD    | `app/modules/cart/CartData.ts`                                       | Centralize feature static values such as dummy API user id and fallback summary metadata |
| ADD    | `app/modules/cart/useCart.ts`                                        | Add cart-screen orchestration hook                                                       |
| MODIFY | `app/modules/cart/index.ts`                                          | Export new screen and types                                                              |
| ADD    | `app/modules/cart/sub-components/cart-item-row/CartItemRow.tsx`      | Cart row UI                                                                              |
| ADD    | `app/modules/cart/sub-components/cart-item-row/CartItemRowStyles.ts` | Themed cart row styles                                                                   |
| ADD    | `app/modules/cart/sub-components/cart-item-row/CartItemRowTypes.ts`  | Cart row props                                                                           |
| ADD    | `app/modules/cart/sub-components/cart-item-row/index.ts`             | Cart row barrel export                                                                   |
| ADD    | `app/modules/cart/sub-components/cart-summary/CartSummary.tsx`       | Pricing summary block                                                                    |
| ADD    | `app/modules/cart/sub-components/cart-summary/CartSummaryStyles.ts`  | Themed summary styles                                                                    |
| ADD    | `app/modules/cart/sub-components/cart-summary/CartSummaryTypes.ts`   | Summary props                                                                            |
| ADD    | `app/modules/cart/sub-components/cart-summary/index.ts`              | Summary barrel export                                                                    |

---

## Implementation Order

### Step 1 — Extend shared contracts and constants

1. Add `cartAdd` and `cartUpdate` endpoints to `APIConst.ts`.
2. Add cart thunk names to `ToolkitAction.ts`.
3. Add transport types for the cart response shape, including line-level discount-field normalization support.
4. Add cart-specific strings and translation entries.
5. Centralize the dummy API `userId` in cart feature data instead of inlining it in components.

### Step 2 — Create the cart Redux domain

1. Add a new `cart` reducer with initial state, selectors, and thunks.
2. Implement `createCart`, `updateCartQuantity`, `removeCartItem`, and hydration helpers using `createAsyncThunkWithCancelToken()`.
3. Normalize both add and update responses into one `CartSnapshot` shape.
4. Track per-product mutation state to guard rapid repeated taps.
5. Register the cart reducer in `Store.ts` and persist only the confirmed cart snapshot state.

### Step 3 — Integrate Product Detail cart controls

1. Read cart selectors from `useDetails.ts`.
2. Derive whether the selected product shows Add to Cart or quantity controls.
3. Wire add, increment, decrement, and remove actions through Redux cart thunks.
4. Add bottom action UI to `DetailsScreen.tsx` and themed styles to `DetailsStyles.ts`.
5. Keep the existing detail loading/error/unavailable flows intact.

### Step 4 — Build the cart screen

1. Replace the placeholder cart landing card with a real cart layout.
2. Add a `useCart.ts` hook to feed rows, summary, empty state, retry state, and control handlers.
3. Create feature-specific sub-components for cart rows and pricing summary.
4. Show all returned cart details: title, thumbnail, quantity, line totals, cart counts, subtotal, discounted subtotal when available, and explicit fallback rows for tax/shipping/grand total.
5. Support increment, decrement, and remove directly from the cart screen.

### Step 5 — Validate persistence and sync behavior

1. Hydrate the cart from persisted state on app relaunch.
2. Confirm that the cart tab and Product Detail page always reflect the same confirmed quantity.
3. Replace local fallback data with the API response after each successful sync.
4. Preserve the last confirmed cart snapshot on failures and show clear recovery messages.

---

## Verification

### Quality gates

```bash
yarn lint
yarn types
```

### Manual checks

1. Open a Product Detail page for a product not in the cart.
2. Tap Add to Cart and confirm a new cart is created through `POST /carts/add`.
3. Confirm the Product Detail footer switches to quantity controls after the first successful add.
4. Increment the same product and confirm the app uses `PUT /carts/{cartId}` and updates the quantity.
5. Decrement the same product to `1`, then decrement/remove again and confirm the Product Detail page returns to Add to Cart.
6. Open the Cart tab and confirm the screen shows the latest confirmed cart item list and all returned cart-level details.
7. Update an item quantity from the Cart tab and confirm the Product Detail page reflects the updated quantity when reopened.
8. Relaunch the app and confirm the locally persisted cart snapshot restores without relying on user id.
9. After a successful sync following relaunch, confirm the API response replaces the local fallback snapshot.
10. Trigger a failed cart mutation and confirm the app shows an error while keeping the last confirmed cart visible.
11. Confirm tax/shipping/grand total rows display safe fallback values when the API does not provide them.

---

## Constraints Reminder

- Do not rely on a stored user id to restore cart state.
- Do not compute fake tax or shipping values.
- Do not merge conflicting local and server cart quantities heuristically.
- Do not add direct API calls inside `CartScreen.tsx` or `DetailsScreen.tsx`.
- Do not introduce hardcoded strings, colors, or raw dimensions.
- Do not create duplicate cart lines for the same product.
