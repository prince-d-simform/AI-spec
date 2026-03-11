# UI Contract: Bottom Tab Navigation

**Type**: Internal UI Navigation Contract  
**Date**: 2026-03-10  
**Feature**: `001-bottom-tab-navigation`

---

## Navigation Graph

The app will expose a root native stack with a nested tab shell:

```text
RootStack
├── RootMain (BottomTabs)
│   ├── Home
│   ├── Cart
│   └── Profile
├── Details
└── SignIn
```

### Rules

1. `RootMain` is the primary app shell.
2. `Home`, `Cart`, and `Profile` are the only bottom tabs for this release.
3. `Details` is not a tab screen.
4. `SignIn` remains outside the bottom tab shell.

---

## Route Contracts

### Root stack params

```typescript
interface RootStackParamList {
  [ROUTES.RootMain]: NavigatorScreenParams<MainTabParamList> | undefined;
  [ROUTES.Details]: { id: string };
  [ROUTES.SignIn]: undefined;
}
```

### Bottom tab params

```typescript
interface MainTabParamList {
  [ROUTES.Home]: undefined;
  [ROUTES.Cart]: undefined;
  [ROUTES.Profile]: undefined;
}
```

### Route rules

1. `ROUTES.Details` requires a non-empty product `id`.
2. `ROUTES.Home`, `ROUTES.Cart`, and `ROUTES.Profile` open without params for this release.
3. `ROUTES.RootMain` is the stack-owned wrapper for the tab navigator and may carry nested tab-screen params when needed.

---

## Header Contract

All screens in scope hide the React Navigation native header.

```typescript
screenOptions = {
  headerShown: false
};
```

### Behavioral rules

1. Home renders its own in-screen header.
2. Cart renders its own in-screen header.
3. Profile renders its own in-screen header.
4. Details renders its own in-screen header and back affordance.
5. No screen in scope relies on the navigator header title or back button.

---

## Home / Details Contract

Home owns the product-listing entry point.

### Flow

```text
RootMain/Home
  → tap product card
Details(id)
  → tap back
RootMain/Home
```

### Rules

1. The Home tab must continue to expose the existing product-listing screen.
2. Product selection from Home must still open `Details` with `{ id }`.
3. The bottom tab bar should not be the primary navigation control inside Product Detail.
4. Returning from Details should restore the shopper to the Home browsing context.

---

## Cart and Profile Dummy-Screen Contract

Cart and Profile are valid primary destinations even before their business features are implemented.

### Required behavior

1. Selecting Cart opens a stable Cart landing screen.
2. Selecting Profile opens a stable Profile landing screen.
3. Each dummy screen must show a clear title and simple explanatory content.
4. Each dummy screen must render without requiring network data, auth changes, or additional configuration.

---

## Tab Bar Contract

### Required behavior

1. The tab bar must always show Home, Cart, and Profile labels.
2. The active tab must be visually distinct from inactive tabs.
3. Tapping a different tab changes the visible primary section in one tap.
4. Tapping the already active tab must not create duplicate navigation layers.

### Optional polish

- Tab icons may be shown using the existing `@expo/vector-icons` dependency.
- Any icon styling must remain theme-aware.

---

## Linking / Helper Contract

1. Internal navigation must continue to use the shared navigator helpers.
2. The linking configuration must remain coherent after introducing `RootMain` as the tab shell.
3. Existing Home and Details entry behavior must continue to work after the navigator refactor.
