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
- 001-bottom-tab-navigation: Added TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + React Navigation 6, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs` (new), `@expo/vector-icons`, i18next 23, Redux Toolkit 2.5
- 001-product-detail-page: Added TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + Redux Toolkit 2.5, react-redux 9.2, redux-persist 6, Apisauce 3.2, Axios 1.10, i18next 23, React Navigation 6
- 001-category-wise-products: Added TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54 + Redux Toolkit 2.5, react-redux 9.2, redux-persist 6, Apisauce 3.2, Axios 1.10, i18next 23, React Navigation 6


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
