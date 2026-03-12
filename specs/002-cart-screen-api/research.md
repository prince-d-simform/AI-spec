# Research: Cart Screen and Item Controls

**Phase 0 — All technical choices resolved**  
**Date**: 2026-03-12

---

## Decision 1: Create a dedicated `cart` Redux domain and persist only the confirmed cart snapshot

**Decision**: Add a new `app/redux/cart/` domain with `CartInitial.ts`, `CartSlice.ts`, `CartSelector.ts`, and `index.ts`, then extend the Redux persist whitelist so the `cart` slice stores only the latest confirmed cart snapshot and hydration metadata.

**Rationale**: Cart state is shared between Product Detail and the cart tab, survives app relaunch, and must not rely on user id restoration. A dedicated slice matches the repo’s Redux Toolkit pattern and keeps cart state separate from `products` browsing state.

**Alternatives considered**:

- Keep cart state only in `CartScreen` or `useDetails.ts` — rejected because cross-screen synchronization and relaunch persistence would drift.
- Store cart inside the existing `products` slice — rejected because cart lifecycle, API semantics, and persistence rules are a separate domain.
- Persist the entire cart slice including transient flags — rejected because stale loading/error UI should not survive relaunch.

---

## Decision 2: Use the latest successful API response as the only canonical cart snapshot

**Decision**: Hydrate UI from local persisted cart data on startup, but after any successful cart API call, replace both Redux state and persisted cart data with the normalized response payload.

**Rationale**: The clarified spec says the API response wins after successful sync and local persistence is fallback only. This avoids heuristic merges and keeps Product Detail, cart rows, totals, and badge-ready counts consistent.

**Alternatives considered**:

- Merge local and remote quantities on every restore — rejected because conflict resolution becomes ambiguous.
- Treat local persistence as the permanent source of truth — rejected because totals and discount data should come from the API when available.
- Skip local hydration entirely — rejected because the feature requires relaunch recovery.

---

## Decision 3: Normalize `POST /carts/add` and `PUT /carts/{cartId}` into one shared transport-to-domain mapping

**Decision**: Model both add and update responses as one shared transport contract and normalize them into a single persisted domain object, `CartSnapshot`.

**Rationale**: Both endpoints return the same cart envelope: `id`, `products`, `total`, `discountedTotal`, `userId`, `totalProducts`, and `totalQuantity`. One normalization path keeps the reducers and selectors simpler and supports the “API response replaces local state” rule.

**Alternatives considered**:

- Maintain separate add-cart and update-cart response models — rejected because it duplicates mapping logic for the same envelope.
- Store the raw API response directly — rejected because the UI needs stable, typed, screen-friendly fields and fallback pricing status.

---

## Decision 4: Use `POST /carts/add` only for first creation, then use `PUT /carts/{cartId}` for all subsequent mutations

**Decision**: When there is no confirmed `cartId`, create the cart through `POST /carts/add` with the application-provided dummy `userId`. Once the app has a confirmed `cartId`, handle all future cart mutations through `PUT /carts/{cartId}`.

**Rationale**: The user-provided API contract requires `userId` only for creation, while the update endpoint keys off `cartId`. Persisting `cartId` locally supports relaunch recovery without relying on a stored user id.

**Alternatives considered**:

- Call `POST /carts/add` for every add-to-cart action — rejected because it would create unrelated carts instead of one active cart.
- Depend on signed-in identity for cart restoration — rejected because guest cart usage is required.

---

## Decision 5: Use additive update calls for increments, and replacement update calls for decrements/removals

**Decision**: For adds and positive quantity increments, use `PUT /carts/{cartId}` with `merge: true` and the changed product payload. For decrements and removals, send the full desired product list through `PUT /carts/{cartId}` without additive merge semantics so the confirmed cart snapshot matches the app’s intended final state.

**Rationale**: DummyJSON documents `merge: true` as the mechanism that includes old products when updating. That is a good fit for additive mutations, but replacement updates are safer for decrements and removals because the app must maintain a single line per product and remove the line entirely when quantity reaches zero.

**Alternatives considered**:

- Use `merge: true` for every mutation, including removals — rejected because additive semantics are not a reliable match for hard removal behavior.
- Introduce cart deletion as the primary last-item removal strategy — rejected for the initial scope because the user only requested create and update integration.

---

## Decision 6: Preserve all API-returned cart details and normalize inconsistent discount field names

**Decision**: Store every shopper-relevant field returned by the cart APIs, including `total`, `discountedTotal`, `totalProducts`, `totalQuantity`, line `price`, `quantity`, `total`, `discountPercentage`, `thumbnail`, and a normalized discounted line amount that accepts either `discountedPrice` or `discountedTotal` from the transport layer.

**Rationale**: The user explicitly asked to show all cart details returned by the API. DummyJSON returns `discountedPrice` in add/update examples while list/single-cart responses expose `discountedTotal` at the line level, so normalization must absorb that inconsistency instead of leaking it to UI components.

**Alternatives considered**:

- Ignore line discount fields and show only totals — rejected because the user asked for all returned details.
- Trust only one remote line-discount key — rejected because DummyJSON cart responses are inconsistent across examples.

---

## Decision 7: Show subtotal, tax, shipping, and grand total rows with safe fallback values

**Decision**: Render cart summary rows for subtotal, tax, shipping, and grand total, but mark tax, shipping, and grand total as unavailable when the latest confirmed cart payload does not provide enough information to confirm them.

**Rationale**: The clarified spec requires those summary rows, but the provided cart API returns `total` and `discountedTotal` only. Defaulting tax or shipping to `0` would be misleading. The safe fallback is to display the API-backed merchandise totals and keep unavailable rows clearly labeled until the backend supplies them.

**Alternatives considered**:

- Default tax and shipping to `0` and treat `discountedTotal` as final grand total — rejected because it fabricates pricing the API did not confirm.
- Remove tax/shipping/grand total rows from the UI — rejected because the clarified requirement explicitly requests them.

---

## Decision 8: Synchronize Product Detail and Cart through selectors keyed by product id

**Decision**: Expose cart selectors such as `getCartItemByProductId`, `getQuantityByProductId`, `getCartItems`, `getCartSummary`, `getCartHydrated`, and per-product mutation flags so both Product Detail and the cart tab read the same state.

**Rationale**: Product Detail needs to switch between Add to Cart and quantity controls, while the cart tab needs row-level controls and totals. Shared selectors keep both screens synchronized and avoid using navigation params or duplicated local quantity state as a state bus.

**Alternatives considered**:

- Pass cart updates through navigation events — rejected because navigation should not own durable state.
- Maintain local quantity state in each screen and sync through effects — rejected because it is fragile under rapid taps and relaunch hydration.

---

## Decision 9: Follow the existing module + hook pattern and add cart-specific sub-components only inside the cart feature module

**Decision**: Keep `CartScreen.tsx` thin, add `useCart.ts` for orchestration, and introduce feature-specific cart sub-components such as row and summary blocks under `app/modules/cart/sub-components/` instead of promoting them immediately to shared components.

**Rationale**: The repository already uses screen-level hooks and feature-local sub-components in the Home module. The current cart tab is only a placeholder and does not yet meet the module pattern, so the plan should bring it into alignment without inventing a new shared design system surface prematurely.

**Alternatives considered**:

- Keep everything in `CartScreen.tsx` — rejected because row, empty-state, and summary logic will grow quickly.
- Add new shared global cart controls under `app/components/` immediately — rejected until there is proven reuse outside cart and Product Detail.

---

## Decision 10: Treat automation and contract mismatches as explicit planning risks

**Decision**: Record two known planning risks: (1) DummyJSON cart transport inconsistencies (`id` vs “productId” wording, `discountedPrice` vs `discountedTotal`), and (2) repository automation warning about multiple `002-*` spec directories.

**Rationale**: These issues do not block the plan, but they affect implementation safety and tooling predictability. They should be visible in project documentation instead of surfacing later as surprises.

**Alternatives considered**:

- Ignore the mismatches as implementation details — rejected because they affect the core contract and automation.
- Pause planning until all tooling warnings are removed — rejected because the active spec path already resolves correctly and the feature can still be designed.
