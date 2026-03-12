import type { CartItemRowViewModel } from '../../CartTypes';
import type { PressableProps } from 'react-native';

export interface CartItemRowProps {
  item: CartItemRowViewModel;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string, quantity: number) => void;
  testID?: string;
  controlHitSlop?: PressableProps['hitSlop'];
}
