import type { Category } from '../../HomeTypes';

/**
 * Props for the CategoryChip component.
 */
export interface CategoryChipProps {
  /** The category data to render */
  category: Category;
  /** Whether this chip is currently active/selected */
  isActive: boolean;
  /** Callback fired with the category slug when the chip is pressed */
  onPress: (slug: string) => void;
}
