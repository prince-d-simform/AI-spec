import type { Product } from '../../HomeTypes';

/**
 * Props for the ProductCard component.
 */
export interface ProductCardProps {
  /** The product data to display */
  product: Product;
  /** Optional tap handler for opening the product detail screen */
  onPress?: (productId: string) => void;
}
