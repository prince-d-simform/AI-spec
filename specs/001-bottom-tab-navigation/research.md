# Research: Bottom Tab Navigation

**Phase 0 — All technical choices resolved**  
**Date**: 2026-03-10

---

## Decision 1: Use a parent native stack with a nested bottom-tab navigator

**Decision**: Keep `createNativeStackNavigator()` as the app root and introduce a nested bottom-tab navigator for the primary app area.

**Rationale**: The repo already uses a native stack as the main navigator. Nesting the tab navigator under a root stack keeps the current navigation architecture intact while enabling three primary tabs without rewriting existing screen flows.

**Alternatives considered**:

- Replace the root stack entirely with bottom tabs — rejected because secondary flows like SignIn and Product Detail still fit best as stack screens.
- Put every screen inside tabs — rejected because Product Detail is a secondary screen, not a primary destination.
- Add a custom in-screen tab switcher instead of React Navigation tabs — rejected because it duplicates navigation behavior and loses platform-standard tab semantics.

---

## Decision 2: Keep `Details` in the root stack above the tabs

**Decision**: The Home tab owns the product-listing entry screen, while `Details` remains a root-stack screen pushed above the tab navigator.

**Rationale**: The user specified that Home includes product listing and product details. In the current codebase, product taps already navigate to `ROUTES.Details`. Keeping Details in the parent stack preserves that flow and prevents the tab bar from appearing on the Product Detail screen unless explicitly desired later.

**Alternatives considered**:

- Place `Details` inside the Home tab navigator — rejected because the tab bar would remain visible on Product Detail unless extra hiding logic is added.
- Make `Details` a fourth hidden tab screen — rejected because it violates the requested three-tab model.
- Delay the Product Detail screen redesign until later — rejected because the user explicitly asked to manage headers and back UI inside screens now.

---

## Decision 3: Hide all React Navigation headers and render screen-owned headers instead

**Decision**: Set `headerShown: false` for both the root stack and the bottom-tab navigator, then render headers and back buttons inside screen components.

**Rationale**: The user explicitly requested removal of the navigation header from all screens. This matches the existing Home pattern, which already renders an in-screen `HomeHeader`. It also makes Details, Cart, and Profile responsible for their own top chrome and back affordances.

**Alternatives considered**:

- Keep stack headers enabled only on Details — rejected because it conflicts with the request to remove navigation headers from all screens.
- Use native headers for top-level screens and custom headers only for Details — rejected because it creates inconsistent screen chrome.
- Remove headers entirely with no in-screen replacement — rejected because secondary screens still need context and back affordances.

---

## Decision 4: Add `cart` and `profile` as proper feature modules with dummy landing screens

**Decision**: Create `app/modules/cart/` and `app/modules/profile/` as full feature modules, each with a themed dummy landing screen and in-screen header.

**Rationale**: The constitution requires feature-module architecture. Even though Cart and Profile are placeholders for now, they should still follow the project’s screen/styles/types/index pattern so future work can extend them cleanly.

**Alternatives considered**:

- Add inline placeholder components directly in `AppNavigation.tsx` — rejected because it violates feature-module architecture.
- Reuse one generic empty screen for both tabs — rejected because Cart and Profile are distinct destinations and should remain independently evolvable.
- Delay Cart and Profile until their business logic exists — rejected because the user explicitly requested three tabs now.

---

## Decision 5: Introduce `@react-navigation/bottom-tabs` and reuse `@expo/vector-icons` for tab affordances

**Decision**: Add `@react-navigation/bottom-tabs` as the new navigation dependency and optionally use the already-installed `@expo/vector-icons` package for tab icons and active-state clarity.

**Rationale**: The repo already relies on React Navigation, so the official bottom-tab package is the lowest-risk extension. `@expo/vector-icons` is already available, making it a good fit if tab icons are included for a clearer, user-friendly bottom bar.

**Alternatives considered**:

- Build a custom tab bar without the bottom-tabs package — rejected because it adds avoidable navigation complexity.
- Use label-only tabs with no icon support at all — not rejected as invalid, but treated as a fallback if design polish is intentionally minimized.
- Switch routing to Expo Router — rejected because the current app is already structured around React Navigation.

---

## Decision 6: Extend route typing and deep-link configuration around a new `RootMain` tab shell

**Decision**: Use `ROUTES.RootMain` as the stack entry for the tab shell, keep `ROUTES.Home`, `ROUTES.Cart`, and `ROUTES.Profile` as tab routes, and keep `ROUTES.Details` as a typed stack route with `{ id: string }`.

**Rationale**: The repo already defines `ROUTES.RootMain`. Using it as the tab-shell route keeps stack and tab responsibilities separate, makes param typing clear, and provides a stable parent for deep-link configuration and internal helper-based navigation.

**Alternatives considered**:

- Make `ROUTES.Home` the stack shell and also a tab route — rejected because it overloads one route with two navigation roles.
- Use untyped nested navigation params — rejected because the constitution requires typed navigation.
- Ignore deep-link config until later — rejected because the root graph changes and should remain coherent even if only Home and Details are externally reachable today.
