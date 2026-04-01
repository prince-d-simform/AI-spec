# Implementation Plan: Profile Screen UI (minimal, read-only)

**Branch**: 001-profile-screen-api | **Date**: 2026-03-16 | **Spec**: specs/001-profile-screen-api/spec.md
**Input**: Feature specification from `/specs/001-profile-screen-api/spec.md`

## Summary

Build a read-only Profile screen that pulls `/users/1`, shows only essential details (avatar, full name, email, phone, role/title, city + country), and removes all image-selection/upload or edit flows. The UI must be theme-aware, string-driven, and handle loading/error/partial data gracefully.

## Technical Context

**Language/Version**: TypeScript 5.8, React Native 0.81.4 (Expo SDK 54)  
**Primary Dependencies**: React Navigation v6, Redux Toolkit 2.5, Apisauce 3 (Axios 1.10), i18next 23, Formik/Yup (validation unused in read-only)  
**Storage**: MMKV via redux-persist (auth/cart persisted; profile remains in-memory)  
**Testing**: Jest + React Testing Library (react-native); lint/types/spelling via `yarn local-check`  
**Target Platform**: iOS/Android mobile app (light/dark theme)  
**Project Type**: Mobile app (feature-module architecture)  
**Performance Goals**: SC-001 ≤3s profile load on stable network; 60 fps render  
**Constraints**: No hardcoded colors/strings; dimensions via `scale()`; theme via `useTheme`; navigation via `ROUTES`/NavigatorUtils; no image picker/upload  
**Scale/Scope**: Single screen + Redux slice; one GET endpoint (`/users/1`)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Principle I (feature-module structure): PASS — existing `modules/profile` follows required layout and barrels.
- Principle II (theme-first): PASS — styles use `useTheme`, `Colors`, `scale`, `ApplicationStyles`.
- Principle III (reuse components): PASS — reuse `CustomHeader`, `Text`, `CustomButton`, `FullScreenLoader`; no new shared components planned.
- Principle IV (strict TS): PASS — no `any`/`@ts-ignore`; types for profile view model/selectors maintained.
- Principle V (strings/i18n): PASS — copy via `Strings.Profile` + `en.json`; no inline strings.
- Principle VI (Redux patterns): PASS — profile slice/thunks/selectors in `app/redux/profile`; no fetch in components.
- Principle VII (typed navigation): PASS — route is `ROUTES.Profile`; navigation helpers unchanged.
- Principle VIII (performance): PASS — memoized subcomponents, `useCallback`/`useMemo` for handlers/derived labels.
- Principle IX (assets): PASS — avatar uses remote URL fallback; no new assets.
- Principle X (static data): PASS — no inline option lists; placeholders from strings.

## Project Structure

### Documentation (this feature)

```text
specs/001-profile-screen-api/
├── plan.md          # This plan
├── research.md      # Phase 0 output
├── data-model.md    # Phase 1 output
├── quickstart.md    # Phase 1 output
├── contracts/       # Phase 1 output
└── tasks.md         # Phase 2 (already exists)
```

### Source Code (repository root)

```text
app/
├── modules/profile/        # Screen, styles, types, hook, sub-components
├── redux/profile/          # Slice, initial state, selectors
├── constants/              # Strings, routes, API constants
├── utils/                  # Validation (unused for read-only), NavigatorUtils
├── navigation/             # AppNavigation (Profile tab)
└── theme/                  # Colors, Metrics, ApplicationStyles

ios/                        # Native project referencing fonts/assets
android/                    # Native project
```

**Structure Decision**: Single mobile app with feature-based modules under `app/modules`; Redux slices under `app/redux`; centralized constants/theme/hooks reused. No backend component in this repo.

## Complexity Tracking

No constitution violations to justify.
