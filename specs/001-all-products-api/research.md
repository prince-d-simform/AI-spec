# Research: All Products Catalog Loading

**Phase 0 — All technical choices resolved**  
**Date**: 2026-03-09

---

## Decision 1: Extend the existing `products` Redux slice

**Decision**: Reuse the existing `app/redux/products/` slice for both category data and the full `All` catalog instead of creating a new Redux domain.

**Rationale**: The user explicitly requested that no new Redux slice be created. This also aligns with the constitution and Redux guidelines that shared async state should remain centralized, typed, and slice-based.

**Alternatives considered**:

- Create a separate `allProducts` slice — rejected because it duplicates product-domain ownership and conflicts with the request.
- Keep all-product API data in `useHome.tsx` local state — rejected because remote async state should not live inside components or hooks only.
- Persist catalog data in storage — rejected because the existing `products` slice is intentionally non-persisted remote UI state.

---

## Decision 2: Fetch `/products` through the existing centralized API stack on initial Home loading

**Decision**: Add a new thunk in `ProductsSlice.ts` that calls the path-only `/products` endpoint through `createAsyncThunkWithCancelToken()` and `unauthorizedAPI`, triggered when the Home screen loads and no successful all-products dataset exists yet.

**Rationale**: This keeps API access consistent with the existing category fetch pattern, satisfies the requirement that the API is called at loading time, and avoids direct HTTP calls in the Home module.

**Alternatives considered**:

- Call the endpoint directly in `useHome.tsx` — rejected because components must not own direct HTTP requests.
- Add a second API client just for catalog data — rejected because the current API helper already supports this endpoint.
- Auto-refetch on every revisit — rejected because the clarified spec requires reuse of the last successful in-memory dataset unless the user explicitly refreshes.

---

## Decision 3: Model `/products` as a wrapper response and normalize before UI storage

**Decision**: Define full transport types for the `/products` response wrapper and nested product records, then normalize each remote record into the existing Home card `Product` shape before storing the canonical list in Redux.

**Rationale**: The remote payload contains many more fields than the Home grid currently renders. Keeping the transport contract fully typed protects the integration, while normalization preserves the minimal UI model already used by `ProductCard`.

**Alternatives considered**:

- Store the raw API response directly in the Home module — rejected because the UI should consume normalized data.
- Define only the six rendered fields and ignore the transport wrapper — rejected because it weakens contract safety and hides pagination metadata.
- Store every nested remote field in Redux state for this feature — rejected because the current feature scope only needs the normalized card list plus response metadata.

---

## Decision 4: Keep one canonical `allProducts` dataset and derive chip filtering locally

**Decision**: Store the full catalog in Redux as the only source of truth for Home products, and continue deriving `filteredProducts` inside `useHome.tsx` based on the active chip.

**Rationale**: This directly satisfies the requirement that switching category chips must not change the underlying `All` dataset. Local derivation also preserves the current Home architecture and avoids unnecessary Redux complexity.

**Alternatives considered**:

- Store separate per-category product arrays in Redux — rejected because it duplicates state and increases synchronization risk.
- Re-fetch a filtered endpoint whenever the chip changes — rejected because the spec explicitly says the all-products dataset must not change during chip switching.
- Mutate the stored all-products array on each chip selection — rejected because it breaks the clarified behavior.

---

## Decision 5: Keep all-product state non-persisted and refresh only via retry or pull-to-refresh

**Decision**: Leave the `products` slice out of the redux-persist whitelist, call `/products` on the first Home load of the session, reuse the loaded dataset on later revisits, and refresh only through explicit retry or pull-to-refresh.

**Rationale**: This matches the clarified spec, preserves the current store configuration, and avoids introducing stale persisted remote catalog data.

**Alternatives considered**:

- Add `products` to persistence — rejected because it changes storage behavior and is not needed for this feature.
- Refresh on every Home revisit — rejected because the clarified spec forbids automatic reloads after the first successful load.
- Provide a dedicated header refresh button — rejected because the chosen manual refresh mechanism is pull-to-refresh on the product list.

---

## Decision 6: Preserve previous successful catalog data on refresh failure

**Decision**: Distinguish between initial load failure and refresh failure. Initial failure shows blocking product error feedback with retry, while refresh failure preserves the last successful `allProducts` dataset and surfaces non-destructive feedback.

**Rationale**: This matches the specification’s recovery rules and keeps browsing stable after the first successful load.

**Alternatives considered**:

- Clear the catalog on refresh failure — rejected because it would erase valid visible data.
- Ignore refresh failures silently — rejected because the shopper needs recovery feedback.
- Treat refresh failure the same as initial failure — rejected because the user experience differs when valid data is already available.

---

## Decision 7: Keep category loading independent so the Home screen can degrade to `All`-only

**Decision**: Continue loading category chips through the existing category request, but allow the Home screen to remain browseable with an `All`-only chip state when categories fail and products succeed.

**Rationale**: The clarified spec explicitly requires the full catalog to remain usable when category metadata is unavailable.

**Alternatives considered**:

- Block the entire screen when categories fail — rejected because it prevents browsing despite valid product data.
- Invent fallback categories from product data in this feature — rejected because the current feature scope does not require replacing the existing category source.
- Hide the chip row entirely on category failure — rejected because the `All` fallback should remain visible.

---

## Decision 8: Request the complete remote catalog rather than the default paginated subset

**Decision**: The `/products` request must be made in a way that retrieves the complete product collection represented by the endpoint contract, and the plan will validate completeness using the response metadata.

**Rationale**: The spec requires the `All` chip to show the complete catalog. A partial page would violate that requirement even if the request technically succeeds.

**Alternatives considered**:

- Accept the endpoint’s default page size — rejected because it may omit products from the `All` view.
- Hardcode a guessed maximum page size — rejected because it is brittle and tied to backend assumptions.
- Add client-side pagination for this feature — rejected because the requested behavior is a full catalog load on Home loading, not incremental paging.
