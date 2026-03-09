import type { Product } from './HomeTypes';

/**
 * Placeholder chip widths used while remote categories are loading.
 */
export const CATEGORY_CHIP_SHIMMER_WIDTHS: readonly number[] = [72, 104, 88, 116, 94] as const;

/**
 * Static list of 14 dummy products spread across 5 categories.
 * - imageUrl uses a deterministic Picsum seed so each product always
 *   renders the same image.
 * - Category values match the category slugs used by the Home screen filter.
 */
export const PRODUCTS: readonly Product[] = [
  // ── Electronics (3) ───────────────────────────────────────────────
  {
    id: 'p-01',
    title: 'Wireless Noise-Cancelling Headphones',
    price: 99.99,
    rating: 4.5,
    category: 'electronics',
    imageUrl: 'https://picsum.photos/seed/p-01/400/600'
  },
  {
    id: 'p-02',
    title: 'Smart Watch Pro Series 5',
    price: 249,
    rating: 4.7,
    category: 'electronics',
    imageUrl: 'https://picsum.photos/seed/p-02/400/600'
  },
  {
    id: 'p-03',
    title: 'Portable Bluetooth Speaker',
    price: 59.99,
    rating: 4.2,
    category: 'electronics',
    imageUrl: 'https://picsum.photos/seed/p-03/400/600'
  },
  // ── Fashion (3) ───────────────────────────────────────────────────
  {
    id: 'p-04',
    title: 'Classic Slim Fit Denim Jacket',
    price: 79.99,
    rating: 4.3,
    category: 'fashion',
    imageUrl: 'https://picsum.photos/seed/p-04/400/600'
  },
  {
    id: 'p-05',
    title: 'Premium Cotton Oversized Tee',
    price: 29.99,
    rating: 4.1,
    category: 'fashion',
    imageUrl: 'https://picsum.photos/seed/p-05/400/600'
  },
  {
    id: 'p-06',
    title: 'Leather Ankle Boots with Side Zip',
    price: 139.5,
    rating: 4.6,
    category: 'fashion',
    imageUrl: 'https://picsum.photos/seed/p-06/400/600'
  },
  // ── Home & Living (2) ─────────────────────────────────────────────
  {
    id: 'p-07',
    title: 'Minimalist Ceramic Desk Lamp',
    price: 44.99,
    rating: 4.4,
    category: 'home-living',
    imageUrl: 'https://picsum.photos/seed/p-07/400/600'
  },
  {
    id: 'p-08',
    title: 'Bamboo Kitchen Cutting Board Set',
    price: 34.99,
    rating: 4,
    category: 'home-living',
    imageUrl: 'https://picsum.photos/seed/p-08/400/600'
  },
  // ── Beauty (3) ────────────────────────────────────────────────────
  {
    id: 'p-09',
    title: 'Vitamin C Brightening Face Serum',
    price: 38,
    rating: 4.8,
    category: 'beauty',
    imageUrl: 'https://picsum.photos/seed/p-09/400/600'
  },
  {
    id: 'p-10',
    title: 'Matte Finish Lipstick Collection',
    price: 22.5,
    rating: 4.3,
    category: 'beauty',
    imageUrl: 'https://picsum.photos/seed/p-10/400/600'
  },
  {
    id: 'p-11',
    title: 'Hydrating Rose Facial Mist',
    price: 18.99,
    rating: 4.5,
    category: 'beauty',
    imageUrl: 'https://picsum.photos/seed/p-11/400/600'
  },
  // ── Sports (3) ────────────────────────────────────────────────────
  {
    id: 'p-12',
    title: 'Professional Yoga Mat Non-Slip',
    price: 55,
    rating: 4.6,
    category: 'sports',
    imageUrl: 'https://picsum.photos/seed/p-12/400/600'
  },
  {
    id: 'p-13',
    title: 'Adjustable Resistance Band Set',
    price: 27.99,
    rating: 4.4,
    category: 'sports',
    imageUrl: 'https://picsum.photos/seed/p-13/400/600'
  },
  {
    id: 'p-14',
    title: 'Lightweight Running Shoes',
    price: 115,
    rating: 4.7,
    category: 'sports',
    imageUrl: 'https://picsum.photos/seed/p-14/400/600'
  }
] as const;
