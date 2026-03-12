import type { CartItemRowViewModel } from '../../CartTypes';

export interface CartItemRowProps {
  item: CartItemRowViewModel;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  testID?: string;
}
