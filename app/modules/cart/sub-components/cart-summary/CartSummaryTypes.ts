import type { CartSummaryRow, CheckoutCallToActionState } from '../../CartTypes';

export interface CartSummaryProps {
  checkoutAction: CheckoutCallToActionState;
  onCheckout: () => void;
  rows: CartSummaryRow[];
  totalProducts: number;
  totalQuantity: number;
}
