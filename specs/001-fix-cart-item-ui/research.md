# Research: Cart Item UI Refinement

**Date**: 2026-03-12  
**Feature**: [spec.md](./spec.md)

---

## Decision 1: Reuse the existing typed details route for cart-item navigation

**Decision**: Navigate from each cart item to the existing product details screen with `navigateWithPush(ROUTES.Details, { id: productId })`.

**Rationale**:

- The app already exposes a typed `Details` route that accepts `{ id: string }`.
- Reusing the current route avoids unnecessary navigation structure changes.
- `NavigatorUtils` is the constitution-approved navigation path, so the feature stays aligned with project rules.

**Alternatives considered**:

- Navigate directly with screen-local `navigation.navigate()` calls — rejected because project guidance requires centralized typed navigation helpers.
- Introduce a new cart-specific details screen — rejected because the existing details experience already satisfies the navigation goal.

---

## Decision 2: Keep navigation orchestration in `useCart` and pass a row press callback into `CartItemRow`

**Decision**: Add one memoized row-press handler in `useCart`, expose it through `UseCartReturn`, and pass it into `CartItemRow` as a typed callback.

**Rationale**:

- `useCart` already owns cart-screen orchestration and row-level handlers.
- Keeping navigation decisions in the hook preserves the current screen/component separation.
- The row component remains a presentational, memoized list item that receives fully prepared behavior through props.

**Alternatives considered**:

- Trigger navigation directly inside `CartScreen.tsx` inline within `renderItem` — rejected because it would add inline list logic and weaken separation of concerns.
- Import navigation helpers directly inside `CartItemRow.tsx` — rejected because it would make the row less reusable and move screen orchestration into a leaf component.

---

## Decision 3: Match the cart row to the attached four-zone wireframe without changing cart business rules

**Decision**: Preserve the existing cart behavior while restructuring each row into a fixed four-zone card: upper-left image, upper-right stacked name and discounted-total block, lower-left quantity-control block, and lower-right stacked pricing block.

**Rationale**:

- The active feature is a UI refinement, not a cart-logic rewrite.
- The current row already contains the required data; the issue is presentation and emphasis.
- The attached wireframe defines both the hierarchy and the block placement, which removes ambiguity about where each detail belongs.
- Separating the lower-left quantity controls from the lower-right pricing copy keeps actions discoverable without crowding the primary shopper information.
- Stacking the discounted-total label and value under the product name makes the top-right block easier to scan as a single summary area.

**Alternatives considered**:

- Keep a chip-based metadata row with product ID — rejected because the user explicitly wants product ID removed from the visible layout.
- Create a new shared card component — rejected because the scope is limited to the cart module and existing feature-specific structure is sufficient.
- Use a looser responsive flow where all details wrap naturally — rejected because it would drift away from the attached wireframe and weaken list consistency.

---

## Decision 4: Preserve list performance by keeping the row height predictable

**Decision**: Keep `FlatList` virtualization optimizations and continue using a predictable cart-row height by clamping long text, keeping the image footprint stable, and adjusting the cart item height constant only if the refined layout needs more vertical space.

**Rationale**:

- The cart list already uses `React.memo`, `useCallback`, and `getItemLayout`.
- A predictable row height avoids unnecessary performance regressions on a list screen.
- The feature requirements can be satisfied through better formatting and spacing rather than fully dynamic row heights, even with the attached four-zone structure.

**Alternatives considered**:

- Switch to fully dynamic row heights and remove `getItemLayout` — rejected because the design problem can be solved without giving up current list optimizations.
- Leave the current cramped layout untouched to keep the height constant — rejected because it fails the readability goal.

---

## Decision 5: Treat missing images and mixed discount states as first-class display states

**Decision**: Explicitly support three presentation states in the row view model: remote image, placeholder image, and optional discount metadata.

**Rationale**:

- The specification requires consistent rendering across missing-image and mixed-pricing scenarios.
- Making these states explicit keeps the layout stable and easier to reason about during implementation.
- The current row already has the source data needed for this refinement.

**Alternatives considered**:

- Let the UI infer everything ad hoc from raw values — rejected because it makes the layout rules harder to maintain.
- Hide pricing differences between discounted and non-discounted items — rejected because shoppers still need truthful pricing context.

---

## Decision 6: Remove product ID from the visible row and prioritize shopper-facing pricing details

**Decision**: Remove product ID from the visible cart row and use the secondary detail row for unit price, line total, and discount details instead.

**Rationale**:

- Product ID is not shopper-relevant for normal cart review.
- The user explicitly requested that product ID be removed.
- Replacing product ID with pricing details improves information density without adding clutter.

**Alternatives considered**:

- Keep product ID as low-emphasis metadata — rejected because it still consumes space the user wants to dedicate to pricing details.
- Move product ID behind an optional expanded state — rejected because the current feature is a layout refinement, not an information disclosure redesign.

---

## Decision 7: Add any new shopper-facing labels through centralized strings only

**Decision**: Any new cart-row copy required for accessibility or navigation affordances will be added through `translations/en.json` and `app/constants/Strings.ts`.

**Rationale**:

- Centralized strings are mandatory under the constitution and project guidelines.
- The cart row already uses `Strings`, so extending that namespace is consistent.
- Accessibility labels for row navigation are likely necessary for a tappable cart item.

**Alternatives considered**:

- Use inline accessibility text in the component — rejected because hardcoded strings are forbidden.
- Reuse unrelated existing strings for row navigation — rejected because that would reduce clarity.

---

## Resolved Clarifications

No unresolved technical clarifications remain for planning.

Resolved planning decisions:

- cart item taps will open the existing product details screen
- typed navigation will use the existing `Details` route contract
- cart logic and quantity mutation behavior remain unchanged
- the row layout will follow the attached four-zone wireframe: image upper-left, name plus discounted-total block upper-right, quantity controls lower-left, and pricing details lower-right
- list performance optimizations stay in place through a predictable row height strategy
- missing images and mixed pricing states remain explicit UI cases
- product ID will be removed from the visible cart row
