# SYNC IMPACT REPORT

Version change: [placeholder] → 1.0.0

Modified principles:

- All placeholders replaced; initial constitution authored from scratch
  using project guidelines, package.json, and copilot-instructions.md.

Added sections:

- Core Principles (10 principles covering architecture, theming, components,
  TypeScript, strings/i18n, Redux, navigation, performance, assets,
  static data)
- Technology Stack & Constraints
- Development Workflow & Quality Gates
- Governance

Removed sections:

- N/A (initial population from template)

Templates reviewed:

- .specify/templates/plan-template.md ✅ Constitution Check aligns
- .specify/templates/spec-template.md ✅ Requirements/scope align
- .specify/templates/tasks-template.md ✅ Phase structure aligns
- .github/copilot-instructions.md ✅ Listed as runtime guidance

Follow-up TODOs:

- TODO(RATIFICATION_DATE): Confirm original project adoption date if
  different from 2026-02-27 and update accordingly.
  ================================================================================
  -->

# AiSpec Constitution

## Core Principles

### I. Clean Code & Feature-Module Architecture (NON-NEGOTIABLE)

Every feature MUST live inside a self-contained module under `app/modules/`.
Every module MUST follow the mandatory directory layout:

```
modules/feature-name/
├── FeatureScreen.tsx      # Entry screen component
├── FeatureStyles.ts       # Screen-level themed styles
├── FeatureTypes.ts        # Screen-level TypeScript types
├── useFeature.ts          # Screen-level custom hook
├── index.ts               # Barrel export
└── sub-components/        # Feature-specific UI components
    ├── SubComponent.tsx
    ├── SubComponentStyles.ts
    ├── SubComponentTypes.ts
    ├── SubComponentUtils.ts
    └── index.ts
```

Reusable UI components MUST live under `app/components/` and follow the
4-file architecture: `Component.tsx`, `ComponentStyles.ts`,
`ComponentTypes.ts`, `index.ts`. One component per file. No merging of
unrelated components into a single file.

File naming MUST follow: PascalCase for components/screens/styles/types,
camelCase for hooks and utilities, UPPER_CASE for constants, lowercase
`index.ts` for barrel files. Every directory MUST expose a barrel `index.ts`.

**Rationale**: A consistent structure makes navigation of the codebase
predictable, reduces onboarding friction, and enables reliable tooling.

### II. Theme-First Styling — No Hardcoded Values (NON-NEGOTIABLE)

ALL styling MUST use the project theme system. The following are strictly
forbidden anywhere in source code:

- Hardcoded hex color values (e.g., `'#FFFFFF'`, `'#E53E3E'`)
- Raw numeric dimensions without `scale()` (e.g., `fontSize: 14`)
- Platform-specific raw values without `globalMetrics` guards

REQUIRED patterns:

```typescript
// Colors — always via theme
backgroundColor: Colors[theme]?.white;
color: Colors[theme]?.primary;

// Dimensions — always scaled
fontSize: scale(14);
padding: scale(16);
borderRadius: globalMetrics.isAndroid ? scale(8) : scale(12);
```

Every component MUST call `useTheme(styleSheet)`. Every styles file MUST
export a `styleSheet` function typed as
`(theme: ThemeMode, isDark?: boolean) => StyleSheet`. `ApplicationStyles(theme)`
MUST be spread first inside every `StyleSheet.create` block.

Supported theme modes: `light`, `dark`, `system`. Theme preference MUST be
persisted via `MMKVKeys.themeMode`.

**Rationale**: Consistent theming guarantees pixel-perfect rendering across
light/dark modes and device densities without scattered overrides.

### III. Reusable-Component Priority

Before creating any new UI component, the developer MUST verify that an
equivalent component does not already exist under `app/components/`. Existing
components (`Button`, `Text`, `CustomHeader`, `Spinner`, `FullScreenLoader`)
MUST be used or extended via props—never duplicated.

New shared components may only be introduced when no existing component can
satisfy the requirement with reasonable prop additions. New shared components
MUST include JSDoc, `displayName`, full TypeScript types, and follow the
4-file architecture from principle I.

**Rationale**: Reuse enforces visual consistency and keeps the design system
as the single source of truth.

### IV. Strict TypeScript — No `any`, No Silent Errors

TypeScript strict mode MUST remain enabled. The following are forbidden:

- `any` type (use `unknown` or a proper interface instead)
- `@ts-ignore` / `@ts-expect-error` without an explanatory comment
- Implicit `any` through untyped parameters or missing return types

Every Redux slice, API response type, navigation parameter, component prop,
and hook return value MUST be fully typed. Shared types live in `app/types/`;
feature-level types live in their respective `FeatureTypes.ts`.

The `yarn types` gate (`tsc --noEmit`) MUST pass with zero errors before any
merge.

**Rationale**: Type safety prevents whole categories of runtime errors and
makes large-scale refactoring safe.

### V. Centralised String Management & Internationalisation

ALL user-facing text MUST be served through `Strings.<Module>.<key>` sourced
from `app/constants/Strings.ts` via i18next. The following are forbidden:

- Inline string literals in JSX (e.g., `<Text>Sign In</Text>`)
- Hardcoded error messages in components
- Direct `I18n.t()` calls inside component or hook files

All new strings MUST be added to `translations/en.json` under the correct
namespace, then exposed in `Strings.ts` as a frozen module object using
`Object.freeze`. Any future language file MUST mirror the `en.json` structure.

**Rationale**: Centralised strings eliminate stale literals, make copy changes
atomic, and provide a clean path to multi-language releases.

### VI. Redux Toolkit — Typed, Slice-Based State Management

All cross-component application state MUST be managed through Redux Toolkit
using `createSlice` and `createAsyncThunk`. Requirements:

- `useAppDispatch` and `useAppSelector` typed hooks MUST be used everywhere;
  bare `useDispatch`/`useSelector` are forbidden.
- Slice initial state MUST be isolated in a `FeatureInitial.ts` file.
- Selectors MUST be co-located in a `FeatureSelectors.ts` file.
- `redux-persist` MUST use MMKV storage with encryption; baseline whitelist
  is `['auth']`. Any addition to the whitelist requires justification.
- `serializableCheck` middleware MUST be configured to ignore persist actions.

Direct `fetch`/`axios` calls inside components are forbidden; all async
side-effects MUST go through RTK thunks or RTK Query (when adopted).

**Rationale**: Centralised, predictable state management prevents prop
drilling, race conditions, and untracked mutations across screens.

### VII. Typed Navigation — ROUTES Enum & NavigatorUtils

ALL navigation MUST use `NavigatorUtils` helper functions
(`navigateWithParam`, `navigateWithReplace`, `navigateWithPush`, `goBack`,
`resetToRoute`, etc.) backed by the typed `ROUTES` enum. Direct calls to
`navigation.navigate()` inside JSX event handlers are forbidden.

Every screen MUST have its route parameters typed in `RootStackParamList`.
Deep-link URL patterns MUST be declared in `DeepLinkConst.ts` and handled
in `DeepLinkUtils.ts`.

**Rationale**: Typed routes catch screen-name typos at compile time and make
the full navigation graph auditable from one source of truth.

### VIII. Performance-First — Mandatory Memoisation & List Optimisation

All components used as list items or rendered at high frequency MUST be
wrapped in `React.memo`. The following MUST be applied consistently:

- `useCallback` for every event handler passed as a prop
- `useMemo` for every expensive derivation or transformed dataset
- `getItemLayout` in every `FlatList` with fixed-height items
- `keyExtractor` as a `useCallback`-memoised function returning stable IDs
- `removeClippedSubviews` enabled on production list screens

Inline anonymous arrow functions in JSX (e.g., `onPress={() => fn(id)}`)
are forbidden inside list `renderItem` callbacks; extract to named
`useCallback` references.

**Rationale**: React Native's JS thread is single-threaded. Unnecessary
re-renders and un-memoised callbacks on list screens directly cause frame
drops that degrade user experience.

### IX. Asset Management — SVG-First, Centralised Barrel

All visual assets MUST be registered through `app/assets/index.ts`.
Format priority: SVG > PNG (@1x/@2x/@3x) > JPG.

SVG files MUST be imported as React components via `react-native-svg-transformer`.
Dimensions MUST use `scale()`. Theme-adaptive icons MUST receive fill/stroke
values from `Colors[theme]`.

No component may import an asset with a relative path that bypasses the barrel;
imports MUST come from `../../assets` (or the equivalent depth).

**Rationale**: SVGs deliver crisp rendering at all densities without
multi-resolution raster duplication. A single barrel makes dead-asset
auditing straightforward.

### X. Static Data — No Inline Literals in Components

All static option lists, configuration objects, and mock/development data
MUST be declared in a dedicated file (e.g., `app/constants/StaticData.ts` or
feature-level `FeatureData.ts`) and marked immutable with `as const`.

Inline arrays or object literals defined directly in component bodies or JSX
are forbidden. String labels within static data MUST reference `Strings`
constants (principle V), not raw string literals.

**Rationale**: Centralised static data makes option sets auditable, localisable,
and swappable without hunting across the codebase.

## Technology Stack & Constraints

**Framework**: React Native 0.81.4 + Expo SDK 54 (managed/bare hybrid workflow)
**Language**: TypeScript 5.8 — strict mode mandatory; `tsc --noEmit` is a CI gate
**State**: Redux Toolkit 2.5 + redux-persist 6 + react-native-mmkv 3.3
**Navigation**: React Navigation v6 — native stack only
**HTTP**: Apisauce 3 (Axios 1.10 wrapper) — all requests via `configs/APIConfig`
**Storage**: MMKV with encryption key from `services/Storage.ts`
**Forms**: Formik 2 + Yup 1 — validation schemas in `utils/ValidationSchema.ts`
**i18n**: i18next 23 + react-i18next 15 — `en.json` is the canonical locale
**Error Tracking**: Sentry 6 — configured per environment in `SentryConfig.ts`
**Dev Tooling**: Reactotron (dev only, guarded by `AppConst.isDevelopment`)
**Environments**: `development` / `preview` / `production` via `.env.*` files
and `react-native-config`; multi-scheme builds via `app.config.js`

**Multi-environment rule**: Environment-specific logic MUST be gated on
`AppConst.isDevelopment`, `AppConst.isStaging`, or `AppConst.isProduction`.
Secrets MUST NOT be committed; `.env.*` files are excluded by `.gitignore`.

## Development Workflow & Quality Gates

### Pre-Commit (enforced by Husky)

- `yarn lint` — ESLint MUST pass with zero errors on every commit.

### Pre-Merge Checklist

- [ ] `yarn lint` passes with zero ESLint errors
- [ ] `yarn types` (`tsc --noEmit`) passes with zero TypeScript errors
- [ ] `yarn spelling` (CSpell) passes with zero unknown words
- [ ] `yarn pretty` (Prettier) formatting applied
- [ ] `yarn test` — all Jest tests green
- [ ] iOS and Android debug builds complete without errors
- [ ] No `any`, no hardcoded colors, no hardcoded strings, no raw dimensions
- [ ] All new components follow 4-file architecture (Principle I)
- [ ] All new strings added to `en.json` and `Strings.ts` (Principle V)
- [ ] `React.memo` / `useCallback` / `useMemo` applied where required
      (Principle VIII)
- [ ] No new assets imported outside the `app/assets` barrel (Principle IX)
- [ ] No inline static data inside component files (Principle X)

### Branch & PR Convention

- Branch name: `###-feature-name` (kebab-case, prefixed with issue/ticket number)
- PR title follows conventional commits format:
  `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Every PR MUST reference the relevant spec from `specs/`

### Canonical Build Commands

| Target                   | Command                    |
| ------------------------ | -------------------------- |
| iOS development          | `yarn ios:dev`             |
| Android development      | `yarn android:dev`         |
| iOS release build        | `yarn ios:dev:release`     |
| Android release build    | `yarn android:dev:release` |
| Full local quality check | `yarn local-check`         |

## Governance

This constitution supersedes all other practices and guideline files in terms
of authority. The guideline files in `.github/guidelines/` serve as detailed
implementation references and MUST remain consistent with the principles
stated here.

**Amendment procedure**:

1. Open a PR with the proposed constitutional change.
2. Increment `CONSTITUTION_VERSION` using semantic versioning:
   - **MAJOR**: Principle removal or backward-incompatible redefinition.
   - **MINOR**: New principle added or material expansion of existing guidance.
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements.
3. Update `LAST_AMENDED_DATE` to the merge date (ISO format YYYY-MM-DD).
4. Propagate changes to all affected guideline files and Specify templates.
5. Prepend a new Sync Impact Report HTML comment to this file.

**Compliance review**: All PRs MUST be reviewed against this constitution.
Any deviation requires explicit written justification in the PR description
and explicit approval from a project maintainer before merge.

**Runtime development guidance**: `.github/copilot-instructions.md` provides
AI-agent-specific implementation guidance and MUST remain consistent with
this constitution. When conflicts arise, this constitution takes precedence.

**Version**: 1.0.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-02-27
