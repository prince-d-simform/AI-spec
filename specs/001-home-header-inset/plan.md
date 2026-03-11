# Implementation Plan: Home Header Top Insets

**Branch**: `001-home-header-inset` | **Date**: 2026-03-11 | **Spec**: `/specs/001-home-header-inset/spec.md`
**Input**: Feature specification from `/specs/001-home-header-inset/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Fix the Home screen header so it respects the top safe area on notched and non-notched devices by applying the device top inset to the Home header section only, reusing the existing safe-area hook infrastructure, and preserving the current Home category row, product grid, and Home → Product Detail behavior.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React Native 0.81.4, Expo SDK 54  
**Primary Dependencies**: React Native Safe Area Context 5.6.1, React Navigation 6, i18next 23, existing `useHeader.ts` safe-area helpers, theme utilities in `app/theme/`  
**Storage**: N/A — this feature is a layout-only correction with no persisted or remote data changes  
**Testing**: `yarn lint`, `yarn types`, and manual visual verification on Home across devices or simulators with different top safe-area shapes  
**Target Platform**: iOS and Android mobile app  
**Project Type**: Mobile app  
**Performance Goals**: Preserve current Home-screen scrolling performance, add no noticeable render cost to the Home header, and avoid layout regressions in the product list or category row  
**Constraints**: Must apply the top inset to the Home header section only, must avoid hardcoded top-spacing guesses, must reuse existing safe-area helper patterns, must preserve Home content and navigation behavior, must use theme-based styling and scaled values, and must not introduce new strings or state unless implementation proves it necessary  
**Scale/Scope**: Touches the Home header subcomponent and styles, with at most minimal adjustments to the surrounding Home screen layout if required for balance

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Review

- **Feature-module architecture**: PASS — the fix stays inside the existing Home module, specifically the `home-header` subcomponent and, only if needed, small Home screen/layout files.
- **Theme-first styling**: PASS — the top spacing change will be expressed through themed styles and scaled dimensions rather than hardcoded platform guesses.
- **Reusable-component priority**: PASS — no new shared component is needed; the existing Home header subcomponent remains the correct ownership point.
- **Strict TypeScript**: PASS — the safe-area value and any derived layout props can remain fully typed with no relaxed typing.
- **Centralized strings/i18n**: PASS — this is a layout-only correction and does not require new user-facing text.
- **Redux Toolkit discipline**: PASS — no new state, selectors, or async flows are required.
- **Typed navigation**: PASS — Home and Details navigation behavior remains unchanged.
- **Performance-first rendering**: PASS — the fix should add only a lightweight safe-area read for the Home header and preserve current list performance.
- **Asset management and static data discipline**: PASS — no new assets or inline static data structures are required.

### Post-Phase 1 Gate Review

- **Result**: PASS
- `research.md` resolves the implementation choice by selecting header-only safe-area handling, reusing `useStatusBarHeight()`, and keeping the change local to the Home header.
- `data-model.md` defines the small layout-state contracts that describe the safe-area input, effective header spacing, and unchanged Home layout flow.
- `contracts/HomeHeaderInsetContract.md` makes the internal layout expectations explicit for the Home header, category row, and product list.
- `quickstart.md` keeps implementation and validation aligned with theme, safe-area, and module-ownership rules.

## Project Structure

### Documentation (this feature)

```text
specs/001-home-header-inset/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── HomeHeaderInsetContract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── hooks/
│   ├── index.ts
│   └── useHeader.ts
└── modules/
    └── home/
        ├── HomeScreen.tsx
        ├── HomeStyles.ts
        └── sub-components/
            └── home-header/
                ├── HomeHeader.tsx
                ├── HomeHeaderStyles.ts
                ├── HomeHeaderTypes.ts
                └── index.ts
```

**Structure Decision**: Use the existing single mobile-app structure and keep the fix localized to `app/modules/home/sub-components/home-header/`. Only touch `HomeScreen.tsx` or `HomeStyles.ts` if the header-only inset requires a minimal balancing adjustment to the surrounding layout.

## Complexity Tracking

No constitution violations or exceptional complexity were required for this plan.
