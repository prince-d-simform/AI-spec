import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

export interface ProfileInfoCardProps {
  label: string;
  value?: string | null;
  placeholder?: string;
  iconName?: ComponentProps<typeof Ionicons>['name'];
}
