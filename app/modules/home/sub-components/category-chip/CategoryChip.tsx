import React, { memo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../../../../components';
import { useTheme } from '../../../../hooks';
import styleSheet from './CategoryChipStyles';
import type { CategoryChipProps } from './CategoryChipTypes';

/**
 * CategoryChip — pill-shaped filter button for the category row.
 *
 * Visual states:
 *  - isActive = true  → filled pill (primary background, white label, weight 700)
 *  - isActive = false → muted pill (chipInactive background, chipInactiveText label)
 *
 * Wrapped in React.memo for shallow-comparison optimization.
 * Calls onPress(category.slug) on press.
 */
const CategoryChip = memo(
  ({ category, isActive, onPress }: CategoryChipProps): React.ReactElement => {
    const { styles } = useTheme(styleSheet);

    const handlePress = useCallback(() => {
      onPress(category.slug);
    }, [category.slug, onPress]);

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
        onPress={handlePress}
      >
        <Text style={isActive ? styles.chipLabelActive : styles.chipLabelInactive}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  }
);

CategoryChip.displayName = 'CategoryChip';

export default CategoryChip;
