# Quickstart: Cart Quantity Controls

**Feature**: `001-cart-quantity-controls`  
**Date**: 2026-03-12

---

## Overview

This feature restores editable cart quantity controls while keeping cart confirmation on `POST /carts/add`.

- Confirmation endpoint: `POST /carts/add`
- Shared mutation rule: add, increment, decrement, and delete all rebuild and submit the full desired cart contents
- Delete rule: remove the product from the request payload instead of sending quantity `0`
- Persistence strategy: keep the latest confirmed cart snapshot in Redux/MMKV
- Product Detail behavior: `Add to Cart` when absent, quantity controls when confirmed
- Cart behavior: editable quantity rows, numeric pricing summary, checkout button in footer
- Pricing fallback: missing tax and shipping display as `0`; missing grand total is derived from confirmed merchandise totals plus displayed fallback values
- Sync rule: the latest successful confirmation response replaces visible and persisted cart state

---

## Files to Touch

| Action | File                                              | What changes                                                                                |
| ------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| MODIFY | `app/constants/Strings.ts`                        | Add quantity-control, delete, summary-fallback, and checkout CTA copy                       |
| MODIFY | `app/translations/en.json`                        | Add matching cart/detail string content                                                     |
| MODIFY | `app/constants/ToolkitAction.ts`                  | Add or rename generalized cart quantity-confirmation actions if needed                      |
| MODIFY | `app/types/CartResponse.ts`                       | Ensure request/response typing supports full-snapshot quantity confirmations                |
| MODIFY | `app/types/index.ts`                              | Re-export required cart transport types                                                     |
| MODIFY | `app/redux/cart/CartInitial.ts`                   | Extend cart state with quantity-mutation metadata and pricing display support               |
| MODIFY | `app/redux/cart/CartSelector.ts`                  | Expose Product Detail and Cart row quantity-control state plus derived display pricing      |
| MODIFY | `app/redux/cart/CartSlice.ts`                     | Generalize `cartAdd` confirmation flow for add/increment/decrement/delete and mutation lock |
| MODIFY | `app/redux/cart/index.ts`                         | Export updated cart actions and selectors                                                   |
| MODIFY | `app/modules/details/DetailsTypes.ts`             | Restore quantity-control types for Product Detail                                           |
| MODIFY | `app/modules/details/useDetails.ts`               | Dispatch add/increment/decrement/delete confirmation intents                                |
| MODIFY | `app/modules/details/DetailsScreen.tsx`           | Render Add to Cart or quantity controls with minus/delete behavior                          |
| MODIFY | `app/modules/details/DetailsStyles.ts`            | Restore and theme quantity-control footer styling                                           |
| MODIFY | `app/modules/cart/CartTypes.ts`                   | Restore editable cart row contracts and checkout CTA state                                  |
| MODIFY | `app/modules/cart/useCart.ts`                     | Feed quantity handlers, numeric summary rows, and checkout CTA state                        |
| MODIFY | `app/modules/cart/CartScreen.tsx`                 | Render editable cart rows and summary footer checkout button                                |
| MODIFY | `app/modules/cart/CartStyles.ts`                  | Support any spacing/layout changes needed for editable rows and footer CTA                  |
| MODIFY | `app/modules/cart/sub-components/cart-item-row/*` | Restore increment/decrement/delete controls with loading and disabled states                |
| MODIFY | `app/modules/cart/sub-components/cart-summary/*`  | Render numeric tax/shipping/grand total values and add checkout button                      |

---

## Implementation Order

### Step 1 — Generalize the cart Redux confirmation flow

1. Replace the add-only request builder with a full-snapshot mutation builder that accepts target quantity changes.
2. Omit deleted products from the outbound payload.
3. Add a cart-wide mutation lock so overlapping full-cart confirmations cannot race.
4. Preserve normalization, persistence, hydration, and failure recovery around the confirmed snapshot.

### Step 2 — Restore Product Detail quantity controls

1. Derive `add` vs `quantity` control state from the confirmed cart snapshot.
2. Reintroduce increment and decrement handlers in the detail hook.
3. Show delete instead of minus when confirmed quantity is `1`.
4. Revert to `Add to Cart` after a confirmed delete removes the product.

### Step 3 — Restore editable Cart rows and summary behavior

1. Reintroduce row-level increment, decrement, and delete handlers.
2. Keep row loading/disabled behavior aligned with the shared mutation lock.
3. Render tax and shipping as `0` when absent.
4. Derive grand total from confirmed discounted subtotal plus displayed tax and shipping values when the API omits grand total.
5. Add checkout CTA content to the cart summary footer.

### Step 4 — Validate persistence and cross-screen consistency

1. Confirm Product Detail and Cart always show the same confirmed quantity after each success.
2. Confirm app relaunch hydrates the last confirmed cart snapshot.
3. Confirm failures keep the last confirmed cart visible and restore control availability.

---

## Verification

### Quality gates

```bash
yarn lint
yarn types
```

### Manual checks

1. Open a Product Detail page for a product not in the confirmed cart and tap `Add to Cart`.
2. Confirm the request sends the full desired cart through `POST /carts/add` and the Product Detail footer switches to quantity controls.
3. Increment quantity on Product Detail and confirm the updated confirmed quantity appears there and later on the Cart screen.
4. Decrement quantity above `1` and confirm the leading control remains minus.
5. Decrement quantity at `1` and confirm the leading control shows delete and removes the product after confirmation.
6. Add multiple products, open the Cart screen, and confirm each row supports increment/decrement/delete behavior.
7. Confirm deleting one row omits that product from the outbound payload while keeping the other confirmed lines.
8. Confirm tax and shipping display `0` when the API does not provide them.
9. Confirm grand total displays a numeric value derived from confirmed merchandise totals plus displayed tax and shipping values.
10. Confirm the checkout button appears at the bottom of the cart summary when items exist.
11. Rapidly tap quantity controls on different products and confirm only one cart confirmation proceeds at a time.
12. Relaunch the app and confirm the last confirmed quantities restore on both Product Detail and Cart.
13. Force a confirmation failure and confirm the last confirmed snapshot remains visible with recovery messaging.

---

## Constraints Reminder

- Do not reintroduce `cartUpdate` or any separate quantity-update endpoint.
- Do not send removed products with quantity `0`; omit them from the request payload.
- Do not place direct API calls inside screen components or hooks.
- Do not use hardcoded strings, colors, or raw dimensions.
- Do not persist UI-only fallback pricing as if it were API-confirmed data.
- Do not allow overlapping full-cart confirmations that can overwrite one another.
