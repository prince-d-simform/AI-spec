# Implementation Plan: Bottom Tab Navigation

**Branch**: `001-bottom-tab-navigation` | **Date**: 2026-03-10 | **Spec**: `/specs/001-bottom-tab-navigation/spec.md`
**Input**: Feature specification from `/specs/001-bottom-tab-navigation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Refactor the app navigation into a root native stack with a nested three-tab primary shell for Home, Cart, and Profile, keep Product Detail as a secondary stack screen reachable from Home, hide all React Navigation headers, move header and back-button UI into screen components, and add themed dummy Cart/Profile modules that satisfy the current architecture and UX requirements.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54  
**Primary Dependencies**: React Navigation 6, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs` (new), `@expo/vector-icons`, i18next 23, Redux Toolkit 2.5  
**Storage**: N/A for this feature; navigation state remains runtime-only and no new persisted data is introduced  
**Testing**: `yarn lint`, `yarn types`, and manual navigation verification across Home, Details, Cart, and Profile  
**Target Platform**: iOS and Android mobile app  
**Project Type**: Mobile app  
**Performance Goals**: Maintain responsive one-tap tab switching, preserve smooth product-list scrolling on Home, and keep secondary navigation transitions responsive with no duplicate-screen buildup during repeated tab presses  
**Constraints**: Must use typed navigation and `ROUTES`, must hide native navigation headers on all screens in scope, must manage header/back UI inside screens, must preserve the existing Home → Details flow, must add Cart/Profile as proper feature modules with dummy screens, must keep all user-facing strings centralized, and must use theme-driven styling only  
**Scale/Scope**: Touches shared navigation, route constants, strings/translations, navigator helpers/linking config, the existing Home and Details modules, and introduces two new feature modules (`cart` and `profile`)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Review

- **Feature-module architecture**: PASS — Cart and Profile will be added as first-class feature modules under `app/modules/`, while Home and Details remain in their existing modules.
- **Theme-first styling**: PASS — the tab-shell presentation and new dummy screens will use themed styles and scaled values rather than hardcoded visual constants.
- **Reusable-component priority**: PASS — the plan reuses existing shared primitives such as `Text`, `CustomButton`, and `CustomHeader` before considering any new shared component work.
- **Strict TypeScript**: PASS — the root stack, nested tab params, route enums, and screen contracts will be fully typed.
- **Centralized strings/i18n**: PASS — tab labels, Cart/Profile placeholder copy, and any Details header/back labels remain in `translations/en.json` and `Strings.ts`.
- **Redux Toolkit discipline**: PASS — no new cross-screen business state is introduced; existing Home/Product Detail Redux behavior remains unchanged.
- **Typed navigation**: PASS — the feature extends the typed route graph and continues to rely on the shared navigator helper pattern.
- **Performance-first rendering**: PASS — Home list behavior stays intact, tab switching is lightweight, and tab configuration can remain static or memoized.
- **Asset management and static data discipline**: PASS — no new raster assets are required; optional tab icons can come from the existing vector icon dependency and any tab descriptors can be centralized static config.

### Post-Phase 1 Gate Review

- **Result**: PASS
- `research.md` resolves the open navigation decisions by selecting a root-stack-plus-tabs structure, keeping Details above the tab shell, and hiding all native headers.
- `data-model.md` defines the nested route contracts, tab descriptors, screen chrome rules, and placeholder landing-screen model without violating the module or type architecture.
- `contracts/BottomTabNavigationContract.md` captures the internal navigation graph and UI chrome contract for Home, Cart, Profile, SignIn, and Details.
- `quickstart.md` keeps the implementation aligned with typed navigation, centralized strings, theme-based styling, and feature-module organization.

## Project Structure

### Documentation (this feature)

```text
specs/001-bottom-tab-navigation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── BottomTabNavigationContract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── components/
│   └── custom-header/
├── constants/
│   ├── NavigationRoutes.ts
│   └── Strings.ts
├── modules/
│   ├── cart/
│   │   ├── CartScreen.tsx
│   │   ├── CartStyles.ts
│   │   ├── CartTypes.ts
│   │   └── index.ts
│   ├── details/
│   │   ├── DetailsScreen.tsx
│   │   ├── DetailsStyles.ts
│   │   ├── DetailsTypes.ts
│   │   ├── useDetails.ts
│   │   └── index.ts
│   ├── home/
│   │   ├── HomeScreen.tsx
│   │   ├── HomeStyles.ts
│   │   ├── HomeTypes.ts
│   │   ├── useHome.tsx
│   │   └── sub-components/
│   ├── profile/
│   │   ├── ProfileScreen.tsx
│   │   ├── ProfileStyles.ts
│   │   ├── ProfileTypes.ts
│   │   └── index.ts
│   └── index.ts
├── navigation/
│   ├── AppNavigation.tsx
│   └── index.ts
├── translations/
│   └── en.json
└── utils/
    └── NavigatorUtils.ts
package.json
```

**Structure Decision**: Use the existing single mobile-app structure. Navigation changes stay centralized in `app/navigation/` and `app/utils/NavigatorUtils.ts`, Home and Details are updated in place, and Cart/Profile are introduced as new feature modules so the repo stays aligned with the constitution’s module architecture.

## Complexity Tracking

No constitution violations or exceptional complexity were required for this plan.
