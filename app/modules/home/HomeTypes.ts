/**
 * HomeTypes.ts
 *
 * Core TypeScript types for the Product Listing Home Screen.
 * These types are shared by HomeData, useHome, Redux normalization, and all sub-components.
 *
 * Source: data-model.md
 */

/**
 * Represents a product grouping used for filtering.
 *
 * - The first entry in CATEGORIES must have slug: 'all' (wildcard — shows all products).
 * - All slug values must be unique and URL-safe (lowercase, hyphenated).
 */
export interface Category {
  /** Display label, e.g. 'Electronics' — sourced from Strings.Home.* */
  name: string;
  /**
   * Filter key used to match Product.category, e.g. 'electronics'.
   * Special value: 'all' → shows all products.
   */
  slug: string;
}

/**
 * Represents a single item in the product catalog.
 * Reused for both full-catalog and selected-category remote responses.
 */
export interface Product {
  /** Unique identifier — also used as the FlatList key */
  id: string;
  /** Display name — max 2 lines shown in card (truncated with ellipsis) */
  title: string;
  /** Numeric price in display currency units, e.g. 29.99 */
  price: number;
  /** Star rating 1.0–5.0 */
  rating: number;
  /** Slug matching a Category.slug (never 'all') */
  category: string;
  /** Remote catalog thumbnail URL for the product card */
  imageUrl: string;
}
