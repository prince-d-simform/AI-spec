# UI Contract: Home Screen

**Type**: React Native Screen Contract  
**Date**: 2026-03-06  
**Feature**: `002-product-listing-home`

---

## Screen Entry Point

```
Route: ROUTES.Home
Component: HomeScreen (app/modules/home/HomeScreen.tsx)
Navigation params: none
```

---

## Component Contracts

### HomeScreen

**File**: `app/modules/home/HomeScreen.tsx`  
**Props**: none (root screen component)  
**Renders**:

1. `<SafeAreaView>` root container with `screenBackground` color
2. `<HomeHeader />` — branded greeting row
3. `<ScrollView horizontal>` of `<CategoryChip />` — category filter row; sticky above grid
4. `<FlatList numColumns={2}>` — product grid OR empty-state `<Text>` when filtered list is empty
   **Delegates**: all state and logic to `useHome()`

---

### useHome (hook contract)

**File**: `app/modules/home/useHome.ts`  
**Returns**:

```typescript
interface UseHomeReturn {
  categories: readonly Category[]; // CATEGORIES constant
  filteredProducts: readonly Product[]; // memoised derived list
  activeCategory: ActiveCategoryFilter; // current slug, default 'all'
  handleCategoryPress: (slug: string) => void; // useCallback — sets activeCategory
  renderProductItem: ({ item }: { item: Product }) => React.ReactElement; // useCallback
  keyExtractor: (item: Product) => string; // useCallback — returns item.id
}
```

---

### HomeHeader

**File**: `app/modules/home/sub-components/home-header/HomeHeader.tsx`  
**Props**: none  
**Renders**: greeting title + optional subtitle. All text from `Strings.Home`.  
**Example output**:

```
Discover Products        ← H1, bold
Find something you love  ← subtitle, gray
```

---

### CategoryChip

**File**: `app/modules/home/sub-components/category-chip/CategoryChip.tsx`  
**Props**:

```typescript
interface CategoryChipProps {
  category: Category;
  isActive: boolean;
  onPress: (slug: string) => void; // consumed via useCallback in parent
}
```

**Visual states**:

- `isActive = true` → filled pill: background `chipActive` (`primary`), label `chipActiveText` (`white`), font weight `700`
- `isActive = false` → outlined pill: background `chipInactive`, label `chipInactiveText` (`gray`)

**Wrapped in `React.memo`**.

---

### ProductCard

**File**: `app/modules/home/sub-components/product-card/ProductCard.tsx`  
**Props**:

```typescript
interface ProductCardProps {
  product: Product;
}
```

**Layout (top → bottom)**:

```
┌─────────────────────┐
│  Image (4:3 ratio)  │  ← aspectRatio: 2/3, resizeMode: cover
│                     │  ← onError → shows imagePlaceholder View
├─────────────────────┤
│  Title (2 lines)    │  ← numberOfLines={2}, ellipsizeMode='tail'
│  $price             │  ← bold, primary color
│  ★ rating           │  ← gold star icon + numeric value
└─────────────────────┘
```

**Card container**: background `cardBackground`, borderRadius `scale(12)`, shadow `cardShadow` (elevation for Android).  
**Wrapped in `React.memo`**.

---

## Strings Contract

New keys required in `en.json` under `"home"` namespace and in `Strings.Home` frozen object:

| Key                   | Value                            |
| --------------------- | -------------------------------- |
| `discoverProducts`    | `"Discover Products"`            |
| `findSomething`       | `"Find something you love"`      |
| `categoryAll`         | `"All"`                          |
| `categoryElectronics` | `"Electronics"`                  |
| `categoryFashion`     | `"Fashion"`                      |
| `categoryHome`        | `"Home & Living"`                |
| `categoryBeauty`      | `"Beauty"`                       |
| `categorySports`      | `"Sports"`                       |
| `emptyState`          | `"No products in this category"` |
| `pricePrefix`         | `"$"`                            |
| `ratingLabel`         | `"{{value}}"` (interpolated)     |

---

## Color Contract

New keys added to `Colors.ts` `themeColors` + light/dark overrides (see `data-model.md` for full table).  
All hex values MUST live in `Colors.ts`. Components reference only `Colors[theme]?.keyName`.

---

## Performance Contract

| Requirement                                                          | Implementation                               |
| -------------------------------------------------------------------- | -------------------------------------------- |
| `ProductCard` only re-renders when its `product` prop changes        | `React.memo` on `ProductCard`                |
| `CategoryChip` only re-renders when `isActive` or `category` changes | `React.memo` on `CategoryChip`               |
| Filtered list not recomputed on every render                         | `useMemo([activeCategory])`                  |
| `handleCategoryPress` stable reference                               | `useCallback([])`                            |
| `renderProductItem` stable reference                                 | `useCallback([])`                            |
| `keyExtractor` stable reference                                      | `useCallback([])`                            |
| Grid reclaims off-screen memory                                      | `removeClippedSubviews={true}` on `FlatList` |
