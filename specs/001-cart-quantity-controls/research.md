# Research: Cart Quantity Controls

**Date**: 2026-03-12  
**Feature**: [spec.md](./spec.md)

---

## Decision 1: Use `cartAdd` as the only cart confirmation endpoint for every cart mutation

**Decision**: Keep `POST /carts/add` as the sole cart write contract for add, increment, decrement, and delete behavior.

**Rationale**:

- The feature specification requires one shared confirmation flow for every cart mutation.
- The current backend capability does not support a separate update endpoint.
- Reusing one thunk-based confirmation path keeps Redux, persistence, and recovery logic centralized.

**Alternatives considered**:

- Reintroduce `cartUpdate` or a separate remove endpoint — rejected because the requested feature explicitly keeps all mutations on `cartAdd`.
- Perform local-only quantity edits and defer sync — rejected because the feature requires confirmed shared state across Product Detail and Cart.

---

## Decision 2: Build every request from the last confirmed full cart snapshot

**Decision**: On add, increment, decrement, or delete, the app will rebuild the full desired cart payload from the latest confirmed snapshot and send it through `cartAdd`.

**Rationale**:

- The API request must preserve all confirmed items, not only the item being edited.
- Full-snapshot submission keeps both screens aligned with one canonical confirmed response.
- The existing normalized cart snapshot already contains the product ids and quantities needed to compose the next payload.

**Alternatives considered**:

- Send only the affected product and quantity — rejected because it would not guarantee preservation of the rest of the confirmed cart.
- Keep duplicate lines for repeat adds — rejected because the specification requires one cart line per product.

---

## Decision 3: Model delete as payload omission, not quantity `0`

**Decision**: Treat delete as a target quantity of `0` in local mutation intent only, then omit that product entirely from the outbound `products` array.

**Rationale**:

- The feature clarification explicitly requires omission of the removed product rather than sending quantity `0`.
- Payload omission keeps the request aligned with the backend contract that expects only active cart lines.
- The same mutation builder can support decrement-to-delete without a separate API flow.

**Alternatives considered**:

- Send `{ id, quantity: 0 }` — rejected by clarification.
- Add a dedicated delete request contract — rejected because the feature requires reuse of the same confirmation flow.

---

## Decision 4: Serialize cart confirmations at cart scope, not only by product

**Decision**: Guard quantity mutations with one cart-wide in-flight confirmation lock so overlapping writes cannot submit competing full-cart payloads.

**Rationale**:

- The request body contains the full desired cart, so concurrent mutations on different products can overwrite each other if both are built from stale snapshots.
- A cart-wide lock is simpler and safer than per-product concurrency for this API model.
- This still satisfies the requirement to prevent overlapping conflicting updates.

**Alternatives considered**:

- Keep the current per-product-only lock — rejected because two different products could still race and lose one confirmed change.
- Queue multiple pending mutations optimistically — rejected for this feature because confirmed-state accuracy is more important than extra complexity.

---

## Decision 5: Keep canonical pricing confirmed, but use display-only fallbacks for tax, shipping, and grand total

**Decision**: Persist confirmed subtotal and discounted subtotal from the API, keep tax/shipping/grand total optional in canonical state, and derive shopper-facing display values as `0`, `0`, and `discountedSubtotal + tax + shipping` when those fields are absent.

**Rationale**:

- The user explicitly requires tax and shipping to show `0` instead of unavailable.
- Deriving display values in selectors or view models satisfies the UI requirement without pretending the backend returned values it did not provide.
- Grand total remains consistent because it is calculated from confirmed merchandise totals plus the displayed tax and shipping values.

**Alternatives considered**:

- Continue showing unavailable placeholders — rejected because the latest feature request explicitly requires `0` and a computed grand total.
- Persist fallback `0` values as if they were API-confirmed fields — rejected because it blurs the distinction between confirmed remote data and UI-only fallback values.

---

## Decision 6: Place the checkout CTA in the existing cart summary footer

**Decision**: Add the checkout button to the bottom of the existing `CartSummary` footer rendered by the cart `FlatList`.

**Rationale**:

- The current cart screen already renders summary content in the list footer, which is the natural location for the final CTA.
- Reusing `CustomButton` inside the summary/footer path avoids a broader screen-layout refactor.
- This keeps the button anchored near totals while preserving current empty/loading/error states.

**Alternatives considered**:

- Add a new sticky bottom bar outside the list — rejected for planning scope because it requires more layout work than the current footer architecture.
- Place checkout above the summary rows — rejected because the CTA should follow the pricing summary.

---

## Decision 7: Restore quantity-control UI from shared selector state on both screens

**Decision**: Product Detail and Cart rows will derive quantity, decrement icon behavior, and loading state from shared cart selectors instead of maintaining screen-local quantity state.

**Rationale**:

- Shared selectors guarantee cross-screen consistency after every confirmed response and after app relaunch.
- The Redux snapshot is already the persisted single source of truth.
- This aligns with the project constitution and existing feature-module architecture.

**Alternatives considered**:

- Keep local screen state and sync it back later — rejected because it risks divergence between Product Detail and Cart.
- Make only the cart screen editable — rejected because Product Detail quantity editing is a P1 scenario in the spec.

---

## Resolved Clarifications

No unresolved technical clarifications remain for planning. The latest planning decisions are:

- all cart mutations use `POST /carts/add`
- delete omits the removed product from the payload
- tax and shipping display as `0` when absent
- grand total is derived from confirmed merchandise totals plus displayed fallback values
- checkout is rendered in the cart summary footer
