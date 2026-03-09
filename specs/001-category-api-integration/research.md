# Research: Product Category Data Integration

**Phase 0 — All technical choices resolved**  
**Date**: 2026-03-09

---

## Decision 1: Reuse the existing central `apiUrl` reference

**Decision**: Replace the fallback for `AppEnvConst.apiUrl` with `https://dummyjson.com` and use that existing central base URL reference for category requests instead of adding `catalogApiUrl`.

**Rationale**: The user explicitly requested that no new base URL be introduced and that the existing `apiUrl` reference be used. This keeps configuration centralized in the current constants/config pattern while aligning the plan with the requested DummyJSON base URL.

**Alternatives considered**:

- Keep a separate `catalogApiUrl` constant and client — rejected because it directly conflicts with the requested approach.
- Hardcode `https://dummyjson.com` in the slice or hook — rejected because it breaks centralized configuration.
- Store a full URL in `APIConst.ts` — rejected because repo conventions keep `APIConst.ts` path-only.

---

## Decision 2: Keep the endpoint path in `APIConst.ts`

**Decision**: Use `/products/categories` as a path-only endpoint constant in `APIConst.ts`.

**Rationale**: This matches the project’s current API constant pattern and cleanly composes with the centralized base URL from `AppEnvConst.apiUrl`.

**Alternatives considered**:

- Inline the endpoint inside `ProductsSlice.ts` — rejected because it scatters endpoint definitions.
- Put the full DummyJSON URL into Redux code — rejected because it duplicates configuration.

---

## Decision 3: Keep category loading in a typed `products` Redux slice

**Decision**: Use the existing `products` Redux domain to own category loading, error, and refresh state through `createAsyncThunkWithCancelToken`, typed selectors, and non-persisted remote state.

**Rationale**: The user explicitly requested proper Redux handling and a products slice. This also matches the constitution and Redux guidelines for shared async state.

**Alternatives considered**:

- Keep categories only in `useHome.tsx` local state — rejected because remote async state should remain centralized.
- Create a separate `categories` slice — rejected because the requested domain is `products` and the current repo already uses that namespace.
- Persist categories in redux-persist — rejected because this remote data should refresh rather than persist.

---

## Decision 4: Normalize the API response to the minimum UI contract

**Decision**: Normalize each remote category to `{ slug, name }`, deduplicate by `slug`, use `slug` as the React key and next-request identifier, derive `name` from `slug` when the payload label is missing, and build the synthetic `All` option with only `slug` and `name`.

**Rationale**: The user explicitly said category listing should not use an `id` field and only needs `slug` for downstream API calls plus `name` for display. This removes unnecessary transport/UI fields and makes `slug` the single stable identifier.

**Alternatives considered**:

- Keep a derived `id` alongside `slug` — rejected because it adds a redundant field the user does not want.
- Preserve `url` in the normalized UI state — rejected because the user only wants `slug` and `name`.
- Pass the raw response through to the UI — rejected because UI state should be normalized and deduplicated.

---

## Decision 5: Keep `activeCategory` as screen-local UI state

**Decision**: Keep `activeCategory` inside `useHome.tsx` and read only the remote category dataset and status flags from Redux.

**Rationale**: Selected chip state is screen-local, transient UI behavior. This keeps Redux focused on shared async data while preserving the current Home hook architecture.

**Alternatives considered**:

- Move the selected category to Redux — rejected because it needlessly globalizes a local interaction.
- Put the selected category into navigation state — rejected because it is not route state.

---

## Decision 6: Replace loading text with shimmer chip placeholders

**Decision**: Remove the loading text from the Home screen and show a themed shimmer/skeleton chip row while categories are loading.

**Rationale**: The user explicitly requested shimmer instead of loading text. Rendering shimmer placeholders in the chip row preserves layout stability and better matches the final UI structure.

**Alternatives considered**:

- Keep the current loading text — rejected because it does not satisfy the request.
- Show a generic spinner — rejected because it does not preserve the chip layout.
- Introduce a large external skeleton library — rejected because a lightweight feature-scoped placeholder is sufficient for this screen.

---

## Decision 7: Preserve inline retry behavior for failures and `All`-only empty states

**Decision**: On request failure, show only the synthetic `All` category together with a category-specific error message and retry action. On empty successful results, show only `All` with no failure messaging.

**Rationale**: This exactly matches the clarified spec behavior and keeps the catalog screen usable.

**Alternatives considered**:

- Block the full screen with an error state — rejected because the catalog must remain usable.
- Hide the category row during failure — rejected because the `All` option must remain available.
- Treat empty results as an error — rejected because empty but successful data should keep the screen usable without a failure state.

---

## Decision 8: Keep all user-facing copy centralized

**Decision**: Keep retry and error text in `translations/en.json` and expose them through `Strings.Home`; remove the dedicated loading string once shimmer replaces loading text.

**Rationale**: The constitution and strings guidelines require centralized strings and forbid inline user-facing text in components.

**Alternatives considered**:

- Inline retry/error copy in screen code — rejected by project rules.
- Use direct translation lookups in components — rejected by project rules.
