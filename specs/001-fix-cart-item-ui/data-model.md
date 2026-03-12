# Data Model: Cart Item UI Refinement

**Date**: 2026-03-12  
**Source**: [spec.md](./spec.md) + [research.md](./research.md)

---

## Entities

### CartItemDisplayContent

The shopper-facing content required to render one cart product row clearly.

```typescript
interface CartItemDisplayContent {
  productId: string;
  title: string;
  quantity: number;
  discountedTotalLabel: string;
  discountedTotalValue?: string;
  unitPriceValue: string;
  lineTotalValue: string;
  discountValue?: string;
  thumbnailUrl?: string;
  imageState: 'remote' | 'placeholder';
}
```

**Validation rules**:

- `productId` must match an existing cart line and remain stable for navigation and mutations.
- `title` must be non-empty and render safely within the configured line limit.
- `quantity` must remain a positive integer.
- `discountedTotalLabel` remains present so the upper-right block can preserve the wireframe's stacked label-and-value structure.
- `discountedTotalValue` should appear in the primary row when discounted pricing is available; otherwise the layout must fall back gracefully to another primary price value.
- `unitPriceValue` and `lineTotalValue` must always be present as shopper-facing currency strings.
- `discountValue` is optional and should only appear when the product has a valid discount to present.
- `imageState` is `placeholder` when the thumbnail is missing or unusable.

---

### CartItemInteractionState

The interactive state for one cart row, covering quantity actions and row navigation.

```typescript
interface CartItemInteractionState {
  productId: string;
  decrementAction: 'minus' | 'delete';
  isMutating: boolean;
  isDisabled: boolean;
  canNavigate: boolean;
  navigationTarget: {
    route: 'Details';
    params: { id: string };
  };
}
```

**Validation rules**:

- `productId` must match the related `CartItemDisplayContent.productId`.
- `decrementAction` is `delete` only when quantity is `1`; otherwise it is `minus`.
- `isMutating` reflects active cart confirmation state for that product.
- `isDisabled` applies to quantity controls only and must not remove the row's product identity.
- `canNavigate` remains `true` while the product still exists in the cart.
- `navigationTarget.params.id` must match the selected cart product id exactly.

**State transitions**:

```text
idle
  → quantity-mutation-pending
  → idle

idle
  → row-pressed
  → details-screen-opened
```

---

### CartItemRowViewModel

The combined cart-row contract consumed by `CartItemRow.tsx`.

```typescript
interface CartItemRowViewModel {
  content: CartItemDisplayContent;
  interaction: CartItemInteractionState;
}
```

**Validation rules**:

- Content and interaction must reference the same `productId`.
- The row must always provide enough information to render readable content without additional screen-level formatting logic.
- The view model must remain serializable and memo-friendly for list rendering.

---

### CartRowLayoutState

A display-only description of layout conditions that affect spacing and visibility.

```typescript
interface CartRowLayoutState {
  titleLineLimit: 2;
  usesFixedHeight: boolean;
  hasDiscount: boolean;
  hasImage: boolean;
  showsPlaceholderImage: boolean;
  topRowLayout: 'imageLeft-primaryDetailsRight';
  bottomRowLayout: 'quantityControlsLeft-pricingDetailsRight';
  primaryDetailsLayout: 'title-discountedTotalLabel-discountedTotalValue';
  quantityControlsLayout: 'decrement-quantity-increment';
  pricingDetailsLayout: 'unitPrice-lineTotal-discount';
}
```

**Validation rules**:

- `titleLineLimit` stays fixed at `2` to protect list consistency.
- `usesFixedHeight` stays `true` while the cart list continues using `getItemLayout`.
- `hasDiscount` is `true` only when discount metadata is available for display.
- `hasImage` and `showsPlaceholderImage` must never both be `true` at the same time.
- `topRowLayout` remains fixed so the image stays in the upper-left while the primary detail stack stays in the upper-right.
- `bottomRowLayout` remains fixed so the quantity controls stay in the lower-left while pricing details stay in the lower-right.
- `primaryDetailsLayout` preserves the attached wireframe's stacked title, discounted-total label, and discounted-total value.
- `quantityControlsLayout` preserves the left-side decrement/quantity/increment grouping.
- `pricingDetailsLayout` preserves the right-side unit price, line total, and discount stacking.

---

### CartScreenInteractionContract

The screen-level handler set returned by `useCart` for row rendering.

```typescript
interface CartScreenInteractionContract {
  handleIncrementCartItem: (productId: string) => void;
  handleDecrementCartItem: (productId: string) => void;
  handlePressCartItem: (productId: string) => void;
}
```

**Validation rules**:

- All handlers must be memoized with `useCallback`.
- `handlePressCartItem` must navigate with the current cart item's `productId`.
- Quantity handlers must preserve the existing cart mutation rules and must not change navigation state.

---

## Derived Rules

### Row formatting rules

1. The top row places the image in the left block and a stacked title plus discounted-total block in the right block.
2. The bottom row places the quantity updater in the left block and stacked unit price, line total, and discount details in the right block.
3. Product ID is not rendered in the shopper-facing row.
4. Missing-image rows preserve the same thumbnail footprint as image-backed rows.
5. Rows with and without discounts share the same structural spacing so the list remains visually consistent.

### Navigation rules

1. Pressing the cart item opens the existing details route for that product.
2. Pressing increment, decrement, or delete does not trigger row navigation.
3. Navigation uses the typed route contract already defined in `RootStackParamList`.

---

## Impacted Existing Types

The likely existing types that this feature will refine are:

- `CartItemRowViewModel` in `app/modules/cart/CartTypes.ts`
- `UseCartReturn` in `app/modules/cart/CartTypes.ts`
- `CartItemRowProps` in `app/modules/cart/sub-components/cart-item-row/CartItemRowTypes.ts`

The underlying Redux cart entities remain functionally unchanged because this feature focuses on presentation and navigation, not cart business logic.
