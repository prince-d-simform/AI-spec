import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

/**
 * Static landing-screen content for the Cart tab.
 */
export interface CartLandingContent {
  iconName: ComponentProps<typeof Ionicons>['name'];
  message: string;
  title: string;
}
