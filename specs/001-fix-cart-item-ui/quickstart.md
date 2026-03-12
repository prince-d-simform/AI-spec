# Quickstart: Cart Item UI Refinement

**Feature**: `001-fix-cart-item-ui`  
**Date**: 2026-03-12

---

## Overview

This feature improves the cart product row presentation so shoppers can scan product details more easily and open product details directly from the cart.

- Visual goal: fixed wireframe-style four-zone hierarchy with image in the upper-left, name plus discounted-total stack in the upper-right, quantity controls in the lower-left, and unit/line/discount pricing in the lower-right
- Interaction goal: tapping a cart product row opens the existing product details screen
- Business-rule goal: keep existing cart quantity behavior unchanged
- Layout goal: remain readable for long titles, missing images, and mixed discount states
- Performance goal: preserve existing list optimizations and memoization patterns

---

## Files to Touch

| Action | File                                              | What changes                                                                                               |
| ------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| MODIFY | `app/modules/cart/CartTypes.ts`                   | Extend row and hook contracts with cart-item press navigation support                                      |
| MODIFY | `app/modules/cart/useCart.ts`                     | Build refined row view models for the new two-line hierarchy and expose a memoized cart-item press handler |
| MODIFY | `app/modules/cart/CartScreen.tsx`                 | Pass the row press callback into the cart item component                                                   |
| MODIFY | `app/modules/cart/CartStyles.ts`                  | Adjust any screen-level spacing required by the refined row layout                                         |
| MODIFY | `app/modules/cart/CartData.ts`                    | Tune the fixed row height if the new layout needs additional vertical space                                |
| MODIFY | `app/modules/cart/sub-components/cart-item-row/*` | Reformat the row layout and support product-item tap behavior                                              |
| MODIFY | `app/constants/Strings.ts`                        | Add new cart-row accessibility or navigation strings if needed                                             |
| MODIFY | `app/translations/en.json`                        | Add matching cart translation keys                                                                         |

---

## Implementation Order

### Step 1 — Refine row contracts and navigation flow

1. Extend the cart row view model and row props for product-item press handling and the new shopper-facing pricing hierarchy.
2. Add `handlePressCartItem` in `useCart` using `navigateWithPush(ROUTES.Details, { id })`.
3. Remove product ID from the visible display contract while keeping navigation keyed by product id internally.
4. Keep quantity action handlers unchanged in behavior.

### Step 2 — Reformat the cart item row UI

1. Convert the row into a clear tappable presentation that matches the attached wireframe, with a top row for image plus primary details and a bottom row for controls plus pricing details.
2. Stack the product name, discounted-total label, and discounted-total value in the upper-right block.
3. Place the quantity updater in the lower-left block and stack unit price, line total, and discount details in the lower-right block.
4. Remove product ID from the visible row.
5. Preserve stable placeholder behavior when images are unavailable.
6. Ensure discount and non-discount states remain aligned.

### Step 3 — Preserve list performance and accessibility

1. Keep row memoization and callback memoization intact.
2. Retain predictable row height and update `CART_LIST_ITEM_HEIGHT` only if needed.
3. Add centralized accessibility labels for row navigation if implementation requires them.
4. Ensure quantity buttons do not accidentally trigger product navigation.

---

## Verification

### Quality gates

```bash
yarn lint
yarn types
```

### Manual checks

1. Open the cart with multiple items and confirm each row matches the attached structure with image upper-left, primary details upper-right, quantity controls lower-left, and pricing details lower-right.
2. Confirm long product titles remain readable, clamp safely, and do not overlap the quantity controls.
3. Confirm the upper-right block stacks the product name, discounted-total label, and discounted-total value in that order.
4. Confirm the lower-left block keeps decrement, quantity, and increment controls grouped together.
5. Confirm the lower-right block stacks unit price, line total, and discount details in that order.
6. Confirm product ID is no longer visible in the cart row.
7. Confirm missing-image rows keep the same alignment and spacing as rows with thumbnails.
8. Confirm discounted and non-discounted rows still look structurally consistent.
9. Tap a cart item outside the quantity controls and confirm the app opens the matching product details screen.
10. Tap increment, decrement, and delete controls and confirm they perform only cart actions without opening the details screen.
11. Confirm the cart still scrolls smoothly with the refined layout.
12. Confirm the row remains readable while controls are disabled during an in-flight cart mutation.

---

## Constraints Reminder

- Do not change cart API behavior or quantity mutation rules.
- Do not add direct `navigation.navigate()` calls inside JSX handlers.
- Do not introduce hardcoded strings, colors, or raw dimensions.
- Do not replace existing shared components unnecessarily.
- Do not regress list performance by abandoning memoization or predictable row rendering without need.
