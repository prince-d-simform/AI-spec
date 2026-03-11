# Quickstart: Bottom Tab Navigation

**Feature**: `001-bottom-tab-navigation`  
**Date**: 2026-03-10

---

## Overview

This feature introduces a three-tab primary navigation shell for the app with Home, Cart, and Profile.

- Primary navigation: bottom tabs
- Tab count: 3
- Tabs: Home, Cart, Profile
- Home scope: product listing remains on Home and Product Detail remains reachable from Home
- Secondary flow: Product Detail stays outside the tab bar as a stack screen
- Cart/Profile scope: themed dummy landing screens for now
- Header policy: hide all React Navigation headers and render header/back UI inside screens

---

## Files to Touch

| Action | File                                    | What changes                                                                |
| ------ | --------------------------------------- | --------------------------------------------------------------------------- |
| MODIFY | `package.json`                          | Add `@react-navigation/bottom-tabs` dependency                              |
| MODIFY | `app/constants/NavigationRoutes.ts`     | Add Cart/Profile tab routes and keep RootMain as the tab shell              |
| MODIFY | `app/constants/Strings.ts`              | Expose tab labels and Cart/Profile dummy-screen strings                     |
| MODIFY | `app/translations/en.json`              | Add Home/Cart/Profile tab and dummy-screen copy                             |
| MODIFY | `app/navigation/AppNavigation.tsx`      | Add nested bottom-tab navigator, typed params, and hide native headers      |
| MODIFY | `app/navigation/index.ts`               | Keep navigation exports aligned if new types/helpers are exported           |
| MODIFY | `app/utils/NavigatorUtils.ts`           | Ensure helper usage and deep-link config remain correct with the tab shell  |
| MODIFY | `app/modules/details/DetailsScreen.tsx` | Add in-screen header/back treatment and remove reliance on navigator header |
| MODIFY | `app/modules/details/DetailsStyles.ts`  | Add styles for the in-screen Product Detail header/back UI                  |
| ADD    | `app/modules/cart/CartScreen.tsx`       | Add Cart dummy landing screen                                               |
| ADD    | `app/modules/cart/CartStyles.ts`        | Add Cart themed styles                                                      |
| ADD    | `app/modules/cart/CartTypes.ts`         | Add Cart screen types if needed                                             |
| ADD    | `app/modules/cart/index.ts`             | Export Cart module                                                          |
| ADD    | `app/modules/profile/ProfileScreen.tsx` | Add Profile dummy landing screen                                            |
| ADD    | `app/modules/profile/ProfileStyles.ts`  | Add Profile themed styles                                                   |
| ADD    | `app/modules/profile/ProfileTypes.ts`   | Add Profile screen types if needed                                          |
| ADD    | `app/modules/profile/index.ts`          | Export Profile module                                                       |
| MODIFY | `app/modules/index.ts`                  | Export the new Cart and Profile screens                                     |
| MODIFY | `app/components/custom-header/*`        | Extend the shared header for screen-owned tab and detail chrome             |

---

## Implementation Order

### Step 1 — Add the navigation dependency and extend route definitions

1. Add `@react-navigation/bottom-tabs` to the project.
2. Extend `ROUTES` with `Cart` and `Profile`.
3. Define a typed `MainTabParamList` and update the root stack types around `ROUTES.RootMain`.

### Step 2 — Refactor navigation into stack + tabs

1. Keep `NavigationContainer` at the root.
2. Add a `MainTabNavigator` inside `AppNavigation.tsx`.
3. Register `Home`, `Cart`, and `Profile` as the three tab screens.
4. Keep `Details` and `SignIn` in the root stack.
5. Set `headerShown: false` for both stack and tab navigators.
6. Use theme-aware labels and icons for the tab bar.

### Step 3 — Add Cart and Profile modules

1. Create `app/modules/cart/` and `app/modules/profile/`.
2. Use themed styles, centralized strings, and feature-module barrel exports.
3. Render a valid landing experience with simple placeholder content for each screen.

### Step 4 — Move screen chrome into screens

1. Keep Home’s in-screen header approach.
2. Add an in-screen header/back affordance to Product Detail.
3. Add in-screen headers to Cart and Profile, preferably by reusing `CustomHeader`.
4. Ensure the tab bar remains visible only on the three primary tab screens.

### Step 5 — Final navigation cleanup

1. Align `NavigatorUtils.ts` and linking config with the tab shell structure.
2. Keep all labels/messages in `Strings.ts` and `en.json`.
3. Validate lint and types.
4. Verify the manual scenarios below.

---

## Verification

### Quality gates

```bash
yarn lint
yarn types
```

### Manual checks

1. Launch the app and confirm the primary app area opens with the Home tab selected.
2. Confirm the bottom tab bar shows Home, Cart, and Profile.
3. Tap Cart and confirm a valid dummy Cart screen opens.
4. Tap Profile and confirm a valid dummy Profile screen opens.
5. Return to Home and confirm the existing product list remains available.
6. Tap a product from Home and confirm Product Detail opens above the tab shell.
7. Confirm no React Navigation header is visible on Home, Details, Cart, or Profile.
8. Confirm Product Detail shows an in-screen back affordance and returns to Home correctly.
9. Confirm switching tabs repeatedly does not create duplicate screens or unstable navigation behavior.
10. Confirm the active tab is visually distinct from inactive tabs.

---

## Constraints Reminder

- Keep Home as the tab that owns the current product-listing experience.
- Keep Product Detail outside the bottom tabs so it behaves as a secondary screen.
- Do not add inline user-facing strings.
- Do not bypass the `ROUTES` enum or `NavigatorUtils` patterns.
- Do not use native navigation headers for screens in scope.
- Do not create ad hoc placeholder screens outside the feature-module structure.
