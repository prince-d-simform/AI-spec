# Quickstart: Product Category Data Integration

**Feature**: `001-category-api-integration`  
**Date**: 2026-03-09

---

## Overview

This feature replaces static Home-screen categories with live category data from DummyJSON while keeping the product grid usable under loading, empty, and failure conditions.

- Base URL source: `AppEnvConst.apiUrl`
- Base URL fallback: `https://dummyjson.com`
- Endpoint: `/products/categories`
- State management: Redux Toolkit `products` slice
- Loading UX: shimmer chip placeholders instead of loading text
- UI fallback: always keep `All` visible

---

## Files to Touch

| Action | File                                                     | What changes                                                                          |
| ------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| MODIFY | `app/constants/AppEnvConst.ts`                           | Replace `apiUrl` fallback with `https://dummyjson.com` and remove extra base URL use  |
| MODIFY | `app/constants/APIConst.ts`                              | Keep `/products/categories` as the path-only endpoint constant                        |
| MODIFY | `app/constants/ToolkitAction.ts`                         | Ensure the products/category thunk action name exists                                 |
| MODIFY | `app/configs/APIConfig.ts`                               | Reuse existing centralized API client path and remove dedicated catalog client usage  |
| MODIFY | `app/redux/products/ProductsInitial.ts`                  | Keep `All` fallback category with only `slug` and `name`                              |
| MODIFY | `app/redux/products/ProductsSlice.ts`                    | Fetch categories, normalize to `{ slug, name }`, dedupe by `slug`, use `All` fallback |
| MODIFY | `app/redux/products/ProductsSelector.ts`                 | Keep typed selectors for category state                                               |
| MODIFY | `app/redux/products/index.ts`                            | Keep barrel exports aligned                                                           |
| MODIFY | `app/redux/Store.ts`                                     | Confirm `products` remains registered and non-persisted                               |
| MODIFY | `app/redux/index.ts`                                     | Re-export products slice modules                                                      |
| MODIFY | `app/types/ProductCategoryResponse.ts`                   | Keep transport type for `{ slug, name, url }[]`                                       |
| MODIFY | `app/types/index.ts`                                     | Export the response type if needed                                                    |
| MODIFY | `app/modules/home/HomeTypes.ts`                          | Remove category `id` and unused `url` from normalized UI type                         |
| MODIFY | `app/modules/home/HomeData.ts`                           | Keep static `PRODUCTS` only; stop treating categories as static data                  |
| MODIFY | `app/modules/home/useHome.tsx`                           | Dispatch fetch, consume selectors, reset invalid selection                            |
| MODIFY | `app/modules/home/HomeScreen.tsx`                        | Use `slug` keys, render shimmer row for loading, keep error/retry behavior            |
| MODIFY | `app/modules/home/HomeStyles.ts`                         | Add theme-driven shimmer layout styles                                                |
| CREATE | `app/modules/home/sub-components/category-chip-shimmer/` | Add feature-scoped shimmer placeholder component files                                |
| MODIFY | `app/translations/en.json`                               | Keep retry/error copy; remove obsolete loading copy if no longer used                 |
| MODIFY | `app/constants/Strings.ts`                               | Expose only the Home copy still used by the screen                                    |

---

## Implementation Order

### Step 1 — Align centralized API configuration

1. Update `AppEnvConst.apiUrl` so its fallback is `https://dummyjson.com`.
2. Keep `/products/categories` in `APIConst.ts`.
3. Ensure `ToolkitAction.ts` exposes the category-loading action name.
4. Refactor `APIConfig.ts` so category requests reuse the existing central API client path instead of a dedicated catalog client.

### Step 2 — Finalize the `products` slice contract

1. Keep category state in `app/redux/products/`.
2. Issue the category fetch through `createAsyncThunkWithCancelToken()` using the centralized base URL.
3. Normalize the remote response by:
   - deduplicating by `slug`,
   - skipping invalid slugs,
   - deriving `name` from `slug` when missing,
   - prepending `All`,
   - omitting `id` and `url` from normalized UI state.
4. Keep selectors typed and expose loading/error/category accessors.
5. Leave the slice non-persisted.

### Step 3 — Wire the Home module to normalized category state

1. Keep `PRODUCTS` local in `HomeData.ts`.
2. In `useHome.tsx`, dispatch category loading on screen mount and retry.
3. Keep `activeCategory` local.
4. Reset `activeCategory` to `all` if the refreshed categories no longer include the selected slug.
5. Continue filtering the local `PRODUCTS` array using the selected `slug`.

### Step 4 — Replace loading text with shimmer placeholders

1. Add a Home feature-specific shimmer chip component under `sub-components/`.
2. Render shimmer placeholders in the chip row while `isCategoryLoading` is true.
3. Remove the visible loading text from the Home screen.
4. Continue showing only `All` plus retry/error UI when the fetch fails.

### Step 5 — Keep strings and styling compliant

1. Keep retry and error strings under the `home` namespace in `en.json`.
2. Remove or stop using the old category-loading string if the shimmer fully replaces it.
3. Ensure shimmer and status styles use theme colors and `scale()`.

---

## Verification

### Quality gates

```bash
yarn lint
yarn types
```

### Manual checks

1. Open the Home screen and confirm category chips load from DummyJSON.
2. Confirm the `All` chip is always first.
3. Confirm category items use `slug` for selection and rendering keys, with no UI dependency on `id`.
4. Confirm duplicate remote categories are not shown.
5. Confirm categories without matching local products show the existing empty state.
6. Confirm loading shows shimmer placeholders instead of category-loading text.
7. Simulate a failed category request and confirm:
   - the screen still renders,
   - only `All` remains visible,
   - an error message appears,
   - retry is available.
8. Simulate an empty category response and confirm only `All` remains visible without a failure message.
9. Refresh categories after selecting a category that disappears and confirm selection resets to `All`.

---

## Constraints Reminder

- Do not add a second base URL constant for catalog data.
- Do not use category `id` in normalized UI state.
- Do not make direct HTTP calls inside components.
- Do not persist the `products` remote category state.
- Keep all user-facing text centralized.
- Keep styles theme-driven and list callbacks memoized.
