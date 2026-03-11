# Data Model: Bottom Tab Navigation

**Date**: 2026-03-10  
**Source**: [spec.md](./spec.md) + [research.md](./research.md)

---

## Entities

### MainTabRoute

Primary navigation destinations exposed in the bottom tab bar.

```typescript
type MainTabRoute = ROUTES.Home | ROUTES.Cart | ROUTES.Profile;
```

**Validation rules**:

- Only `Home`, `Cart`, and `Profile` are valid bottom-tab destinations for this release.
- The active tab must always be exactly one of the three supported routes.
- Re-selecting the active tab must not create duplicate navigation layers.

---

### MainTabParamList

Typed route contract for the bottom-tab navigator.

```typescript
interface MainTabParamList {
  [ROUTES.Home]: undefined;
  [ROUTES.Cart]: undefined;
  [ROUTES.Profile]: undefined;
}
```

**Validation rules**:

- Each tab opens without required route params in this release.
- The three tab routes must remain stable so navigation helpers and tab configuration stay aligned.
- Future Cart/Profile params must be additive and must not break default tab entry.

---

### RootStackParamList

Typed route contract for the top-level stack that owns the tab shell and secondary flows.

```typescript
interface RootStackParamList {
  [ROUTES.RootMain]: NavigatorScreenParams<MainTabParamList> | undefined;
  [ROUTES.Details]: { id: string };
  [ROUTES.SignIn]: undefined;
}
```

**Validation rules**:

- `RootMain` is the entry route for the bottom-tab shell.
- `RootMain` may optionally carry nested tab-screen params when deep links or internal navigation target a specific tab.
- `Details` remains a secondary stack screen and requires a non-empty product `id`.
- `SignIn` remains outside the tab shell.

---

### TabDescriptor

Static configuration object describing one tab item.

```typescript
interface TabDescriptor {
  routeName: MainTabRoute;
  label: string;
  iconName?: string;
  testID: string;
}
```

**Validation rules**:

- `label` must come from centralized strings.
- `routeName` must map to a registered tab screen.
- `iconName`, when used, must come from an existing icon set already available to the app.
- `testID` should remain stable for UI verification.

---

### ScreenChromePolicy

Presentation rules that determine where top chrome is rendered.

```typescript
interface ScreenChromePolicy {
  routeName: ROUTES;
  showNativeHeader: false;
  showCustomHeader: boolean;
  showBackButton: boolean;
  showTabBar: boolean;
}
```

**Validation rules**:

- `showNativeHeader` is always `false` for all screens in scope.
- Primary tab screens show custom headers but no back button.
- `Details` shows a custom header with back affordance.
- The bottom tab bar is shown only inside the tab shell, not on secondary stack screens like `Details` or `SignIn`.

---

### DummySectionLanding

Minimal screen content model for temporary Cart and Profile destinations.

```typescript
interface DummySectionLanding {
  routeName: ROUTES.Cart | ROUTES.Profile;
  title: string;
  message: string;
}
```

**Validation rules**:

- Each destination must have a unique shopper-facing title and message.
- All strings must be sourced through `Strings.ts` and translations.
- The landing state must render cleanly even with no user data or business content.

---

### TabSelectionState

Derived navigation state representing the currently visible primary section.

```typescript
interface TabSelectionState {
  activeTab: MainTabRoute;
  previousTab?: MainTabRoute;
}
```

**Validation rules**:

- `activeTab` must match the visible tab screen.
- `previousTab` is optional and only relevant when the user switches tabs.
- Secondary stack navigation such as Product Detail must not corrupt the primary active-tab identity.

**State transitions**:

```text
app-enter
  → RootMain/Home
Home active
  → tap Cart
Cart active
  → tap Profile
Profile active
  → tap Home
Home active
  → open Details
Details stack screen over Home tab
  → back
Home active
```

---

## Relationships

- `RootStackParamList` owns `MainTabParamList` through `ROUTES.RootMain`.
- `MainTabRoute` values map one-to-one with `TabDescriptor` records.
- `ScreenChromePolicy` applies to both tab screens and secondary stack screens.
- `DummySectionLanding` provides the initial content for the `Cart` and `Profile` tab routes.
- `TabSelectionState` is derived from the active navigator state rather than stored in Redux.
