import type { CartSummaryRow } from '../../CartTypes';

export interface CartSummaryProps {
  rows: CartSummaryRow[];
  totalProducts: number;
  totalQuantity: number;
}
