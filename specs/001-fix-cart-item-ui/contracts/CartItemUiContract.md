# UI Contract: Cart Item Row Refinement

**Type**: Internal UI Interaction Contract  
**Date**: 2026-03-12  
**Feature**: `001-fix-cart-item-ui`

---

## Scope

This contract defines how one cart product row must present content and respond to shopper interaction on the cart screen.

The contract applies to:

- `app/modules/cart/useCart.ts`
- `app/modules/cart/CartScreen.tsx`
- `app/modules/cart/sub-components/cart-item-row/*`

---

## Row Content Contract

Each rendered cart row must expose the following shopper-facing content:

1. Product image or a stable placeholder
2. Product title
3. Discounted-total label in the primary detail block
4. Discounted total price in the primary detail block when available
5. Quantity updater in the lower-left control block
6. Unit price, line total, and discount details in the lower-right pricing block
7. Quantity action controls

### Required presentation rules

- The top row must place the image in the left block and a stacked primary-detail block in the right block.
- The upper-right primary-detail block must stack product title, discounted-total label, and discounted-total value in that order.
- The bottom row must place the quantity-control block on the left and the pricing-detail block on the right.
- The lower-right pricing block must stack unit price, line total, and discount details in that order.
- Product title is the most visually prominent text in the detail area.
- Primary shopper price information must be easier to scan than secondary metadata.
- Product ID must not appear in the visible row.
- Rows with missing images must preserve the same media footprint as rows with images.
- Rows with and without discounted pricing must remain structurally aligned.

---

## Navigation Contract

### Trigger

A shopper press on the cart item opens the product details screen for that row's product.

### Route contract

```typescript
navigateWithPush(ROUTES.Details, { id: productId });
```

### Rules

1. The selected `productId` must come from the rendered cart row.
2. Navigation must use the existing typed `Details` route.
3. The cart row press behavior must be wired through a memoized handler from `useCart`.
4. Product-item navigation must not alter cart quantities.

---

## Quantity Action Contract

### Supported actions

- Increment quantity
- Decrement quantity
- Delete when quantity is `1`

### Rules

1. Quantity actions preserve the existing cart mutation behavior.
2. Quantity controls remain visually grouped inside the lower-left block and separated from the pricing stack.
3. Quantity control presses must not trigger product-item navigation.
4. Disabled or loading control states must not break row readability.

---

## Fallback Contract

### Missing image

When a product thumbnail is unavailable:

- Render a placeholder inside the same thumbnail frame.
- Keep alignment identical to image-backed rows.
- Keep the row tappable for navigation.

### Long title

When a product title is long:

- Clamp the title to the configured line limit.
- Preserve readable spacing around price and control content.
- Avoid overlap, clipping, or layout collapse.

### Mixed pricing

When discount data is unavailable:

- Hide only the discount-specific presentation.
- Keep title, primary price, and control alignment consistent with discounted rows.
- Preserve the same top-right and bottom-right block structure even when discounted total is unavailable.

---

## Accessibility Contract

1. The cart item press target must expose an appropriate accessibility role for navigation.
2. Any new accessibility labels must come from centralized strings.
3. Quantity controls must continue using explicit increment, decrement, and delete accessibility labels.
4. The row structure must remain understandable when controls are temporarily disabled.

---

## Non-Goals

This contract does not change:

- cart API endpoints
- cart mutation rules
- cart summary calculations
- product detail data loading behavior
