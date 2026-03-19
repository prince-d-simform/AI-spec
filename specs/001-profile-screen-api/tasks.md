# Tasks: Profile Screen UI (minimal, read-only)

**Input**: Design documents from `/specs/001-profile-screen-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align documentation, flags, and strings to the read-only scope before implementation.

- [x] T001 [P] Update specs/001-profile-screen-api/quickstart.md to reflect read-only scope (remove edit/avatar steps, keep fetch/retry flow)
- [x] T002 [P] Add profile feature flags defaulting to disabled (`PROFILE_EDIT_ENABLED`, `PROFILE_AVATAR_UPLOAD_ENABLED`) in app/constants/AppEnvConst.ts with exports in app/constants/index.ts
- [x] T003 [P] Add profile strings namespace (titles, error/retry/offline, missing-field placeholders) in app/constants/Strings.ts and translations/en.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, state, navigation, and theme scaffolding required before any user story.

- [x] T004 Define profile response/view models and mapping helpers per data-model in app/types/ProfileResponse.ts and app/modules/profile/ProfileTypes.ts
- [x] T005 [P] Create profile redux slice scaffolding (initial state, selectors, action placeholders) in app/redux/profile/ProfileSlice.ts and app/redux/profile/ProfileSelectors.ts
- [x] T006 [P] Register ROUTES.Profile and wire screen entry in app/constants/NavigationRoutes.ts and app/navigation/AppNavigation.tsx using NavigatorUtils
- [x] T007 [P] Establish profile module barrels and theme-aware styles (ApplicationStyles, Colors, scale) in app/modules/profile/index.ts and app/modules/profile/ProfileStyles.ts

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 - View profile details (Priority: P1) 🎯 MVP

**Goal**: Display fetched profile data (avatar, full name, email, phone, city/country, role) with loading/error/retry while remaining strictly read-only.

**Independent Test**: Open Profile screen after sign-in; loader shows, data populates from GET /users/1; simulate failure to see error + retry; partial data shows placeholders without edit controls.

### Implementation for User Story 1

- [x] T008 [US1] Implement fetchProfile thunk using Apisauce GET /users/1 with error handling and auth expiry handling in app/redux/profile/ProfileSlice.ts
- [x] T009 [P] [US1] Map API response to view model fields (fullName, role, location, avatar fallback) in app/redux/profile/ProfileMappers.ts consumed by selectors
- [x] T010 [US1] Implement useProfile hook to dispatch fetch on focus, expose loading/error/retry, and memoize derived labels in app/modules/profile/useProfile.ts
- [x] T011 [US1] Render read-only ProfileScreen UI with shared components (CustomHeader, Text variants, FullScreenLoader, CustomButton for retry) in app/modules/profile/ProfileScreen.tsx and app/modules/profile/ProfileStyles.ts
- [x] T012 [P] [US1] Integrate Strings placeholders for missing fields and offline/error states, including retry/back navigation handling via NavigatorUtils in app/modules/profile/ProfileScreen.tsx

**Checkpoint**: User Story 1 independently testable (view-only profile fetch).

---

## Phase 4: User Story 2 - Update profile details (Priority: P2) — Deferred per plan

**Goal**: Keep profile screen read-only while documenting and gating future edit flows.

**Independent Test**: Edit controls absent or disabled; UI copy explains view-only; feature flag prevents navigation to edit; backlog documented for future re-enable.

### Implementation for User Story 2

- [x] T013 [US2] Hide/disable edit controls and add view-only messaging driven by Strings and `PROFILE_EDIT_ENABLED` in app/modules/profile/ProfileScreen.tsx
- [x] T014 [P] [US2] Wire `PROFILE_EDIT_ENABLED` flag consumption in app/modules/profile/useProfile.ts to block edit handlers and navigation attempts
- [x] T015 [US2] Document deferred edit backlog (scope, endpoints, validation) in specs/001-profile-screen-api/checklists/profile-editing.md

**Checkpoint**: User Story 2 acknowledged and safely deferred without exposing edit UI.

---

## Phase 5: User Story 3 - Update profile photo (Priority: P3) — Deferred per plan

**Goal**: Keep avatar display-only while documenting and gating future upload flow.

**Independent Test**: Avatar tap/picker actions are disabled; UI remains view-only; backlog for upload exists and tied to feature flag.

### Implementation for User Story 3

- [x] T016 [US3] Remove or disable avatar picker triggers and show view-only tooltip/copy using Strings in app/modules/profile/ProfileScreen.tsx
- [x] T017 [P] [US3] Wire `PROFILE_AVATAR_UPLOAD_ENABLED` flag consumption in app/modules/profile/useProfile.ts to prevent picker/upload invocation
- [x] T018 [US3] Document deferred avatar upload backlog (contract POST /users/1/avatar, compression rules) in specs/001-profile-screen-api/checklists/avatar-upload.md

**Checkpoint**: User Story 3 acknowledged and safely deferred without exposing avatar upload UI.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T019 Run quickstart validation for the read-only flow per specs/001-profile-screen-api/quickstart.md
- [ ] T020 [P] Lint/type pass and cleanup across profile module/redux/constants to remove unused edit/upload code and ensure barrels in app/modules/profile and app/redux/profile
- [ ] T021 [P] Update documentation links/checklists to ensure plan, research, and tasks stay in sync in specs/001-profile-screen-api/

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → User Stories (US1 → US2 → US3) → Polish.
- US1 delivers MVP; US2/US3 remain gated by flags and documentation.

### User Story Dependencies

- US1 depends on foundational types/state/navigation.
- US2 depends on US1 scaffold to place view-only messaging and flag gating.
- US3 depends on US1 avatar display to apply gating and messaging.

### Within-Story Order

- Fetch/mappers before hooks; hooks before UI wiring; strings integrated before UI finalized; flags before gating behavior.

## Parallel Opportunities

- Setup: T001–T003 can run in parallel (docs, flags, strings affect different files).
- Foundational: T005 and T006/T007 can proceed alongside T004 once type shape agreed; minimal file overlap.
- US1: T009 can proceed after T008 contract confirmed; T010/T012 can run alongside UI build T011 once selectors exposed.
- US2: T013/T014 can run in parallel (UI vs hook flag gating) after US1 UI baseline.
- US3: T016/T017 can run in parallel (UI vs hook flag gating) after US1 avatar display baseline; T018 independent.

## Implementation Strategy

- **MVP first (US1 only)**: Deliver read-only fetch/display with robust loading/error/placeholder states.
- **Incremental**: After MVP, land deferral artifacts/flags for US2 and US3 without enabling edit/upload.
- **Team parallelization**: One dev on Redux/mappers (T008–T009), one on hooks/UI (T010–T012), another on flags/documentation deferral tasks (T013–T018).
