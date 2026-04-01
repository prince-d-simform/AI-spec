# AI-Spec Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-03

## Active Technologies
- TypeScript 5.8 (strict mode) + React Native 0.81.4, Expo SDK 54, React Navigation v6 (002-product-listing-home)
- N/A (static dummy data only, no persistence) (002-product-listing-home)
- TypeScript 5.8 (strict mode) + React Native 0.81.4, Expo SDK 54, Redux Toolkit 2.5, React Redux 9.2, Apisauce 3.2, Axios 1.10, i18next 23 (001-category-api-integration)
- Redux in-memory state for categories; no persistence for the new `products` slice; centralized constants for base URL and endpoin (001-category-api-integration)
- TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + Redux Toolkit 2.5, react-redux 9.2, redux-persist 6, Apisauce 3.2, Axios 1.10, i18next 23, React Navigation 6 (001-category-api-integration)
- MMKV-backed redux-persist is present for `auth`; category state remains non-persisted remote UI state (001-category-api-integration)
- MMKV-backed redux-persist is present for `auth`; the `products` slice remains non-persisted remote UI state (001-all-products-api)
- MMKV-backed redux-persist is present for `auth`; `products` remains non-persisted remote UI state (001-category-wise-products)
- MMKV-backed redux-persist is present for `auth`; product-detail UI state remains non-persisted Redux state in memory (001-product-detail-page)
- TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + React Navigation 6, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs` (new), `@expo/vector-icons`, i18next 23, Redux Toolkit 2.5 (001-bottom-tab-navigation)
- N/A for this feature; navigation state remains runtime-only and no new persisted data is introduced (001-bottom-tab-navigation)
- TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + React Native Safe Area Context 5.6.1, React Navigation 6, i18next 23, existing `useHeader.ts` safe-area helpers, theme utilities in `app/theme/` (001-home-header-inset)
- N/A — this feature is a layout-only correction with no persisted or remote data changes (001-home-header-inset)
- TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + Redux Toolkit 2.5, react-redux 9.2, redux-persist 6, react-native-mmkv 3.3, Apisauce 3.2, Axios 1.10, React Navigation 6, i18next 23, Expo Vector Icons 15 (002-cart-screen-api)
- MMKV-backed redux-persist already exists; extend persistence to include a minimal confirmed `cart` snapshot independent of user id (002-cart-screen-api)
- TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + Redux Toolkit 2.5, redux-persist 6, react-native-mmkv 3.3, Apisauce 3.2, React Navigation 6, i18next 23 (001-cart-add-only)
- MMKV-backed redux-persist for the confirmed cart snapshot and hydration metadata (001-cart-add-only)
- TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + React Navigation 6, Redux Toolkit 2.5, react-redux 9.2, Expo Vector Icons 15, i18next 23 (001-fix-cart-item-ui)
- Existing MMKV-backed redux-persist cart snapshot; no new storage required (001-fix-cart-item-ui)
- TypeScript 5.8, React Native 0.81.4 (Expo SDK 54) + React Navigation v6, Redux Toolkit 2.5 + redux-persist + MMKV, Apisauce 3 (Axios 1.10), Formik 2 + Yup 1, i18next 23 (001-profile-screen-api)
- MMKV (persisted whitelist currently auth; profile not persisted unless justified) (001-profile-screen-api)

- TypeScript 5.8 — strict mode; React Native 0.81.4 + Expo SDK 54 + `react-native` (Text, StyleSheet), `useTheme` hook, `scale()` from Metrics, `Colors`/`ApplicationStyles` from theme barrel (003-text-variant-component)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.8 — strict mode; React Native 0.81.4 + Expo SDK 54: Follow standard conventions

## Recent Changes
- 001-profile-screen-api: Added TypeScript 5.8, React Native 0.81.4 (Expo SDK 54) + React Navigation v6, Redux Toolkit 2.5 + redux-persist + MMKV, Apisauce 3 (Axios 1.10), Formik 2 + Yup 1, i18next 23
- 001-fix-cart-item-ui: Added TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + React Navigation 6, Redux Toolkit 2.5, react-redux 9.2, Expo Vector Icons 15, i18next 23
- 001-fix-cart-item-ui: Added TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + React Navigation 6, Redux Toolkit 2.5, react-redux 9.2, Expo Vector Icons 15, i18next 23


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
