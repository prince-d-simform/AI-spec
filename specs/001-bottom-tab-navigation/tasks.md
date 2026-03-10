# Tasks: Bottom Tab Navigation

**Input**: Design documents from `/specs/001-bottom-tab-navigation/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/BottomTabNavigationContract.md, quickstart.md

**Tests**: No dedicated automated test tasks included. The feature docs request lint, type, and manual navigation validation rather than a TDD-first workflow.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when the tasks touch different files and do not depend on unfinished work
- **[Story]**: User story label for story-phase tasks only (`[US1]`, `[US2]`, `[US3]`)
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the dependency and shared route/string surface required for the tab-shell refactor

- [x] T001 Add the `@react-navigation/bottom-tabs` dependency in package.json
- [x] T002 [P] Add `Cart` and `Profile` route entries while preserving `RootMain`, `Home`, `Details`, and `SignIn` in app/constants/NavigationRoutes.ts
- [x] T003 [P] Add centralized bottom-tab labels and Cart/Profile dummy-screen copy in app/translations/en.json and app/constants/Strings.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the nested stack-plus-tabs navigation shell and shared exports before any story-specific screen work begins

**⚠️ CRITICAL**: No user story work should begin until this phase is complete

- [x] T004 Refactor app/navigation/AppNavigation.tsx to define typed `RootStackParamList`, typed `MainTabParamList`, a `MainTabNavigator`, and global `headerShown: false` configuration
- [x] T005 [P] Align app/utils/NavigatorUtils.ts deep-link configuration and tab-navigation helper compatibility with the new `ROUTES.RootMain` tab shell
- [x] T006 [P] Update app/navigation/index.ts and app/modules/index.ts to export the navigation/module surface needed by the tab implementation

**Checkpoint**: The root navigation architecture is ready for screen-level tab and header work

---

## Phase 3: User Story 1 - Switch Primary Sections (Priority: P1) 🎯 MVP

**Goal**: Let shoppers switch between Home, Cart, and Profile from a bottom tab bar while keeping Home as the primary browsing tab and Product Detail as a secondary stack screen

**Independent Test**: Launch the app, confirm Home is the default tab, then switch to Cart and Profile in one tap each and return to Home without breaking the existing Home → Details flow

### Implementation for User Story 1

- [x] T007 [P] [US1] Create the Cart dummy module files in app/modules/cart/CartScreen.tsx, app/modules/cart/CartStyles.ts, app/modules/cart/CartTypes.ts, and app/modules/cart/index.ts
- [x] T008 [P] [US1] Create the Profile dummy module files in app/modules/profile/ProfileScreen.tsx, app/modules/profile/ProfileStyles.ts, app/modules/profile/ProfileTypes.ts, and app/modules/profile/index.ts
- [x] T009 [US1] Register Home, Cart, and Profile as the three bottom-tab screens while keeping Details above the tab shell in app/navigation/AppNavigation.tsx
- [x] T010 [US1] Verify Home remains the product-listing tab and that product-card navigation still pushes Product Detail from app/modules/home/useHome.tsx and app/navigation/AppNavigation.tsx

**Checkpoint**: User Story 1 should now provide a working three-tab shell with Home as the default entry and Product Detail still reachable from Home

---

## Phase 4: User Story 2 - Understand Current Location (Priority: P2)

**Goal**: Make the active tab visually clear and ensure the bottom navigation feels user friendly and stable

**Independent Test**: Visit Home, Cart, and Profile and confirm the active tab is always visually distinct and repeated tab taps do not create unstable navigation behavior

### Implementation for User Story 2

- [x] T011 [US2] Add bottom-tab labels, optional icons, and active/inactive theme-aware tab styling in app/navigation/AppNavigation.tsx
- [x] T012 [P] [US2] Add any shared static tab descriptor configuration needed for stable tab rendering in app/navigation/AppNavigation.tsx and app/constants/Strings.ts
- [x] T013 [US2] Ensure repeated tab selection stays stable and does not create duplicate layers through the navigator configuration in app/navigation/AppNavigation.tsx and app/utils/NavigatorUtils.ts

**Checkpoint**: User Story 2 should now make the active primary section obvious and keep tab switching stable

---

## Phase 5: User Story 3 - Reach Every Main Section Reliably (Priority: P3)

**Goal**: Provide valid Home, Cart, and Profile landing experiences with in-screen headers and an in-screen back pattern for Product Detail after removing native navigation headers

**Independent Test**: Open Cart and Profile to confirm both show stable placeholder content with in-screen headers, then open Product Detail from Home and confirm it shows its own header/back UI without any React Navigation header

### Implementation for User Story 3

- [x] T014 [P] [US3] Add themed in-screen header and placeholder content to app/modules/cart/CartScreen.tsx and app/modules/cart/CartStyles.ts
- [x] T015 [P] [US3] Add themed in-screen header and placeholder content to app/modules/profile/ProfileScreen.tsx and app/modules/profile/ProfileStyles.ts
- [x] T016 [US3] Replace navigator-header dependence with screen-owned header/back UI in app/modules/details/DetailsScreen.tsx and app/modules/details/DetailsStyles.ts
- [x] T017 [US3] Reuse or minimally extend the shared header component for screen-owned headers and back affordances in app/components/custom-header/CustomHeader.tsx and app/components/custom-header/CustomHeaderTypes.ts

**Checkpoint**: User Story 3 should now give each primary tab a valid landing screen and keep header/back behavior inside screens

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final alignment, validation, and documentation across all bottom-tab stories

- [x] T018 [P] Align feature documentation with the final implementation in specs/001-bottom-tab-navigation/quickstart.md, specs/001-bottom-tab-navigation/data-model.md, and specs/001-bottom-tab-navigation/contracts/BottomTabNavigationContract.md
- [x] T019 Run lint/type cleanup across package.json, app/constants/NavigationRoutes.ts, app/constants/Strings.ts, app/translations/en.json, app/navigation/AppNavigation.tsx, app/navigation/index.ts, app/utils/NavigatorUtils.ts, app/modules/index.ts, app/modules/home/useHome.tsx, app/modules/details/DetailsScreen.tsx, app/modules/details/DetailsStyles.ts, app/components/custom-header/CustomHeader.tsx, app/components/custom-header/CustomHeaderTypes.ts, app/modules/cart/CartScreen.tsx, app/modules/cart/CartStyles.ts, app/modules/cart/CartTypes.ts, app/modules/cart/index.ts, app/modules/profile/ProfileScreen.tsx, app/modules/profile/ProfileStyles.ts, app/modules/profile/ProfileTypes.ts, and app/modules/profile/index.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** — No dependencies; can start immediately
- **Phase 2: Foundational** — Depends on Phase 1 and blocks all user stories
- **Phase 3: User Story 1** — Depends on Phase 2 and delivers the MVP tab-shell experience
- **Phase 4: User Story 2** — Depends on Phase 2 and builds on the tab shell from US1
- **Phase 5: User Story 3** — Depends on Phase 2 and is safest after US1 establishes the three-tab structure
- **Phase 6: Polish** — Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion and does not depend on other user stories
- **User Story 2 (P2)**: Starts after Foundational completion, but is safest after US1 establishes the bottom-tab shell
- **User Story 3 (P3)**: Starts after Foundational completion, but is safest after US1 establishes the final screen ownership pattern

### Within Each User Story

- Module scaffolding before navigator registration
- Navigator wiring before active-state polish
- Tab-shell completion before screen-owned header cleanup
- Documentation alignment and validation after implementation is complete

### Suggested Story Completion Order

1. **US1** → establish the three-tab shell and preserve Home → Details
2. **US2** → polish active-tab clarity and stable tab behavior
3. **US3** → add reliable dummy landings and screen-owned header/back UI

---

## Parallel Opportunities

- **Setup**: `T002` and `T003` can run in parallel after `T001`
- **Foundational**: `T005` and `T006` can run in parallel after `T004` starts the navigator refactor
- **US1**: `T007` and `T008` can run in parallel before `T009`
- **US2**: `T012` can run in parallel with the styling work in `T011`
- **US3**: `T014` and `T015` can run in parallel; `T017` can proceed once the screen-owned header needs are clear
- **Polish**: `T018` can run before `T019`

---

## Parallel Example: User Story 1

```text
After the foundational navigation shell is defined:
- T007 [US1] Create the Cart dummy module files in app/modules/cart/CartScreen.tsx, app/modules/cart/CartStyles.ts, app/modules/cart/CartTypes.ts, and app/modules/cart/index.ts
- T008 [US1] Create the Profile dummy module files in app/modules/profile/ProfileScreen.tsx, app/modules/profile/ProfileStyles.ts, app/modules/profile/ProfileTypes.ts, and app/modules/profile/index.ts
```

## Parallel Example: User Story 3

```text
Once the tab-shell registration is stable:
- T014 [US3] Add themed in-screen header and placeholder content to app/modules/cart/CartScreen.tsx and app/modules/cart/CartStyles.ts
- T015 [US3] Add themed in-screen header and placeholder content to app/modules/profile/ProfileScreen.tsx and app/modules/profile/ProfileStyles.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate Home default entry, Cart/Profile switching, and Home → Details behavior independently
5. Demo or review the MVP before polishing tab visuals and header ownership

### Incremental Delivery

1. Deliver **US1** for the three-tab shell and preserved Home → Details flow
2. Add **US2** for active-tab clarity and stable repeated tab behavior
3. Add **US3** for dummy Cart/Profile landings and screen-owned header/back UI
4. Finish with Phase 6 cleanup and validation

### Parallel Team Strategy

With multiple developers:

1. One developer completes Phase 1 and Phase 2 shared route/navigation groundwork
2. After the tab shell is stable:
   - Developer A: Cart module in app/modules/cart/
   - Developer B: Profile module in app/modules/profile/
   - Developer C: Details/custom-header adjustments in app/modules/details/ and app/components/custom-header/
3. Complete documentation alignment and validation as the final shared step

---

## Notes

- `[P]` tasks target different files with low coordination needs
- No dedicated automated test tasks were generated because the spec did not explicitly request them
- Each user story remains independently verifiable through the manual scenarios captured in quickstart.md
- Prefer small commits per task or per checkpoint
- Validate lint/types after each logical group of implementation tasks
