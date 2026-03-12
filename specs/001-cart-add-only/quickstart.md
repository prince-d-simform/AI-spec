# Quickstart: Add-Only Cart Flow

**Feature**: `001-cart-add-only`  
**Date**: 2026-03-12

---

## Overview

This feature removes unsupported cart update behavior and keeps cart confirmation add-only.

- Confirmation endpoint: `POST /carts/add`
- Removed behavior: direct cart update/remove flows and `cartUpdate`
- Confirmation rule: every successful add submits the full desired cart contents
- Persistence strategy: keep the latest confirmed cart snapshot in Redux/MMKV
- Product Detail behavior: switch between `Add to Cart` and a non-editable added state
- Cart screen behavior: review-only list of confirmed items and pricing summary
- Sync rule: the latest successful add response replaces visible and persisted cart state

---

## Files to Touch

| Action | File                                              | What changes                                                                            |
| ------ | ------------------------------------------------- | --------------------------------------------------------------------------------------- |
| MODIFY | `app/constants/APIConst.ts`                       | Remove `cartUpdate` and keep add-only endpoint usage                                    |
| MODIFY | `app/constants/ToolkitAction.ts`                  | Remove unsupported update/remove cart action names and keep add-only action names       |
| MODIFY | `app/constants/Strings.ts`                        | Update detail/cart copy for add-only and review-only states                             |
| MODIFY | `app/translations/en.json`                        | Align cart/detail text with add-only flow                                               |
| MODIFY | `app/types/CartResponse.ts`                       | Remove/update unsupported update request contract usage if still present                |
| MODIFY | `app/types/index.ts`                              | Re-export only the required add-only cart transport types                               |
| MODIFY | `app/redux/cart/CartSlice.ts`                     | Remove update/remove thunks and submit full cart contents through add-only confirmation |
| MODIFY | `app/redux/cart/CartSelector.ts`                  | Expose add-only/read-only product detail and cart review selector state                 |
| MODIFY | `app/redux/cart/CartInitial.ts`                   | Simplify failure-operation typing for add-only flow if needed                           |
| MODIFY | `app/redux/cart/index.ts`                         | Export only the remaining add-only cart actions/selectors                               |
| MODIFY | `app/redux/Store.ts`                              | Preserve add-only cart snapshot persistence behavior                                    |
| MODIFY | `app/modules/details/DetailsTypes.ts`             | Replace quantity-edit control contract with add/added read-only state                   |
| MODIFY | `app/modules/details/useDetails.ts`               | Dispatch add-only confirmation and derive read-only added state                         |
| MODIFY | `app/modules/details/DetailsScreen.tsx`           | Remove quantity controls and render add/added state                                     |
| MODIFY | `app/modules/details/DetailsStyles.ts`            | Remove unsupported quantity-control styling and add added-state styling                 |
| MODIFY | `app/modules/cart/CartTypes.ts`                   | Replace editable row contracts with review-only cart row contracts                      |
| MODIFY | `app/modules/cart/useCart.ts`                     | Feed review-only item and summary data without edit handlers                            |
| MODIFY | `app/modules/cart/CartScreen.tsx`                 | Render review-only cart content, empty state, and recovery state                        |
| MODIFY | `app/modules/cart/CartStyles.ts`                  | Align cart screen visuals with review-only layout                                       |
| MODIFY | `app/modules/cart/sub-components/cart-item-row/*` | Remove increment/decrement/remove affordances and render read-only item details         |
| MODIFY | `app/modules/cart/sub-components/cart-summary/*`  | Keep explicit pricing rows with unavailable-state support                               |

---

## Implementation Order

### Step 1 — Remove unsupported update contracts

1. Remove `cartUpdate` from shared API constants.
2. Remove unsupported update/remove thunk action names from toolkit constants.
3. Update cart transport typing and exports so they describe add-only request/response behavior.

### Step 2 — Simplify the cart Redux domain

1. Remove direct update/remove thunks and selectors that expose editable cart control state.
2. Keep one add-only confirmation thunk that composes the full desired cart contents from the latest confirmed snapshot plus the newly added product.
3. Preserve normalization, persistence, hydration, and failure recovery around the confirmed snapshot.

### Step 3 — Convert Product Detail to add-only/read-only behavior

1. Derive `add` vs `added` UI state from the confirmed cart snapshot.
2. Keep the `Add to Cart` action only when the product is absent from the confirmed cart.
3. Replace quantity-edit controls with a non-editable added-state summary once the product is confirmed.

### Step 4 — Convert the Cart tab to review-only behavior

1. Remove increment, decrement, and remove handlers from the cart hook and row components.
2. Render confirmed item details, confirmed quantities, and pricing summary rows only.
3. Preserve empty, loading, and recovery states.

### Step 5 — Validate persistence and recovery

1. Confirm app relaunch hydrates the last confirmed cart snapshot.
2. Confirm the latest successful add response replaces older local fallback data.
3. Confirm failures keep the last confirmed cart visible.

---

## Verification

### Quality gates

```bash
yarn lint
yarn types
```

### Manual checks

1. Open a Product Detail page for a product not in the confirmed cart.
2. Tap `Add to Cart` and confirm the app submits the add-only request and shows a confirmed added state after success.
3. Reopen that same product and confirm the page still shows the added state instead of editable quantity controls.
4. Add a different product and confirm the request preserves previously confirmed items while adding the new product.
5. Open the Cart tab and confirm it shows confirmed items, confirmed quantities, and pricing rows with no increment, decrement, or remove controls.
6. Verify the Cart tab empty state when no confirmed items exist.
7. Relaunch the app and confirm the last confirmed cart restores without relying on user id lookup.
8. Force an add failure and confirm the app shows recovery messaging while preserving the last confirmed cart.
9. Confirm unavailable tax/shipping/grand total values render as unavailable instead of fake totals.
10. Rapid-tap `Add to Cart` and confirm duplicate in-flight confirmations are guarded.

---

## Constraints Reminder

- Do not use `cartUpdate` or any direct cart update/remove endpoint.
- Do not expose unsupported quantity-edit or remove controls in the UI.
- Do not rely on stored user id for cart restoration.
- Do not compute fake pricing values when the backend does not confirm them.
- Do not add direct API calls inside screen components or hooks.
- Do not introduce hardcoded strings, colors, or raw dimensions.
