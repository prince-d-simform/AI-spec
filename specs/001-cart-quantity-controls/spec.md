# Feature Specification: Cart Quantity Controls

**Feature Branch**: `[001-cart-quantity-controls]`  
**Created**: 2026-03-12  
**Status**: Draft  
**Input**: User description: "Add increment and decrement quantity functionality for Product Detail and Cart, showing delete at quantity one and using the same cart confirmation flow for all quantity changes."

## Clarifications

### Session 2026-03-12

- Q: On delete, should the cart confirmation send the removed product with quantity 0 or omit it and send the full remaining cart? → A: Omit the removed product and send the full remaining cart.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Adjust quantity from product details (Priority: P1)

As a shopper viewing a product, I want to increase or decrease its cart quantity directly from the product detail page so I can manage my cart without leaving the product.

**Why this priority**: Product Detail is the most immediate place where shoppers decide whether to add more or remove an item, so quantity control here delivers the core cart-management value.

**Independent Test**: Open a product that is already in the cart, use the quantity controls on Product Detail, and confirm the quantity changes correctly while the control icon switches between minus and delete at the right time.

**Acceptance Scenarios**:

1. **Given** a shopper is viewing a product that is already in the cart with quantity greater than 1, **When** the shopper selects the decrement control, **Then** the quantity decreases by 1 and the control continues to show a minus icon.
2. **Given** a shopper is viewing a product that is in the cart with quantity 1, **When** the shopper views the decrement control, **Then** the control shows a delete icon instead of a minus icon.
3. **Given** a shopper is viewing a product that is in the cart with quantity 1, **When** the shopper selects the delete control, **Then** the product is removed from the cart, the cart confirmation sends the full remaining cart without that product, and the primary action returns to Add to Cart.
4. **Given** a shopper is viewing a product that is in the cart, **When** the shopper selects the increment control, **Then** the quantity increases by 1 and the updated quantity is shown immediately after confirmation.

---

### User Story 2 - Adjust quantity from the cart screen (Priority: P2)

As a shopper reviewing my cart, I want to change item quantities from the cart screen so I can quickly update multiple items in one place.

**Why this priority**: The cart screen is the natural review surface for cart management and should offer the same quantity-control behavior as Product Detail.

**Independent Test**: Add products to the cart, open the cart screen, and confirm each row supports increment, decrement, and delete behavior with the same icon rules as Product Detail.

**Acceptance Scenarios**:

1. **Given** the shopper opens the cart screen with an item quantity greater than 1, **When** the shopper selects the decrement control for that item, **Then** the quantity decreases by 1 and the control continues to show a minus icon.
2. **Given** the shopper opens the cart screen with an item quantity of 1, **When** the shopper views the decrement control, **Then** the control shows a delete icon.
3. **Given** the shopper opens the cart screen with an item quantity of 1, **When** the shopper selects the delete control, **Then** the item is removed from the cart, the cart confirmation sends the full remaining cart without that product, and the cart summary updates to reflect the removal.
4. **Given** the shopper opens the cart screen with cart items, **When** the shopper selects the increment control for one item, **Then** only that item's quantity and the related cart totals update after confirmation.
5. **Given** the confirmed cart response does not include tax or shipping values, **When** the shopper reviews the cart summary, **Then** tax and shipping display as 0 and the grand total is calculated from the confirmed merchandise total plus those fallback values.
6. **Given** the shopper opens the cart screen with confirmed items, **When** the summary is rendered, **Then** a checkout button appears at the bottom of the cart screen.

---

### User Story 3 - Keep quantity state consistent across screens (Priority: P3)

As a shopper, I want quantity changes made on one screen to appear correctly on the other so I can trust the cart state everywhere in the app.

**Why this priority**: Cross-screen consistency is essential once cart quantity changes are available in multiple places.

**Independent Test**: Change quantity on Product Detail, confirm the Cart screen matches; then change quantity on the Cart screen and confirm Product Detail reflects the same confirmed state.

**Acceptance Scenarios**:

1. **Given** a shopper changes quantity on Product Detail, **When** the shopper opens the cart screen, **Then** the cart screen shows the same confirmed quantity and matching icon behavior.
2. **Given** a shopper changes quantity on the cart screen, **When** the shopper opens the same product's detail page, **Then** the product detail page shows the same confirmed quantity and matching icon behavior.
3. **Given** a shopper relaunches the app after confirmed quantity changes, **When** the cart state is restored, **Then** both Product Detail and the cart screen reflect the last confirmed quantities.

### Edge Cases

- If a shopper taps increment or decrement repeatedly before confirmation finishes, the system should prevent duplicate conflicting updates for the same product.
- If a quantity change fails, the system should keep the last confirmed quantity visible and show a clear recovery message.
- If the shopper removes the final remaining unit of an item, the product should disappear from the cart and revert to Add to Cart on Product Detail.
- If the shopper removes the final item from the cart, the cart should transition to its empty state.
- If a shopper removes an item, the cart confirmation should omit that product and send only the remaining confirmed cart items.
- If quantity changes affect cart totals, the summary should reflect only the latest confirmed values and never show unconfirmed totals.
- If tax, shipping, or grand total values are absent from the confirmed response, the cart screen should display 0 for tax and shipping and calculate grand total without showing an unavailable placeholder.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST allow shoppers to increment cart quantity from both Product Detail and the cart screen.
- **FR-002**: The system MUST allow shoppers to decrement cart quantity from both Product Detail and the cart screen.
- **FR-003**: When an item's confirmed quantity is greater than 1, the decrement control MUST display a minus icon.
- **FR-004**: When an item's confirmed quantity is exactly 1, the decrement control MUST display a delete icon.
- **FR-005**: When a shopper activates the decrement control while quantity is 1, the system MUST remove that item from the cart.
- **FR-006**: After an item is removed from Product Detail, the purchase area MUST revert to the Add to Cart action.
- **FR-007**: The cart screen MUST update item rows and cart totals after each confirmed quantity change.
- **FR-008**: Product Detail and the cart screen MUST always reflect the same confirmed quantity for the same product.
- **FR-009**: Every quantity change and removal action MUST use the same cart confirmation flow rather than a separate update flow.
- **FR-010**: Each cart confirmation request MUST include the affected product identifier and its updated target quantity, unless the action removes that product entirely.
- **FR-011**: When a product is removed, the cart confirmation request MUST omit that product and send the full remaining confirmed cart.
- **FR-012**: The system MUST maintain only one cart line per product and update that line's quantity instead of creating duplicates.
- **FR-013**: The system MUST prevent overlapping quantity-change requests for the same product while a confirmation is already in progress.
- **FR-014**: If a quantity change fails, the system MUST keep the last confirmed cart state visible and show a recovery message.
- **FR-015**: The system MUST restore the latest confirmed item quantities after app relaunch.
- **FR-016**: The cart summary MUST reflect the latest confirmed cart contents after each successful quantity change.
- **FR-017**: When confirmed tax or shipping values are unavailable, the cart summary MUST display 0 for those rows.
- **FR-018**: The cart summary MUST calculate grand total from the latest confirmed merchandise totals plus displayed tax and shipping values when the backend does not provide a confirmed grand total.
- **FR-019**: The cart screen MUST show a checkout button anchored at the bottom summary area whenever the confirmed cart contains items.

### Key Entities _(include if feature involves data)_

- **Cart**: The shopper's active collection of items, including confirmed line items, totals, and the current confirmed state shared between screens.
- **Cart Item**: A single product entry in the cart, including product identity, confirmed quantity, and item-level pricing.
- **Quantity Control State**: The control state for a cart item that determines whether the shopper sees increment, minus, or delete behavior based on the confirmed quantity and request status.

## Assumptions

- Quantity changes continue to use the existing cart confirmation capability instead of introducing a separate cart-update capability.
- The cart supports a single active cart for the shopper at one time.
- Quantity changes apply to products already eligible for cart operations.
- The cart summary remains based on confirmed backend values rather than optimistic local estimates.
- Sign-in remains outside the scope of this feature.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: At least 95% of shoppers can increase or decrease quantity from Product Detail on their first attempt without leaving the screen.
- **SC-002**: At least 95% of shoppers can increase, decrease, or remove items from the cart screen on their first attempt.
- **SC-003**: At least 95% of cross-screen quantity checks show the same confirmed quantity for the same product immediately after the shopper opens the second screen.
- **SC-004**: 100% of items with confirmed quantity 1 show a delete icon instead of a minus icon.
- **SC-005**: 100% of failed quantity changes preserve the last confirmed cart state and present a visible recovery message.
- **SC-006**: At least 95% of successful quantity changes update the related cart summary values within 2 seconds of confirmation.
