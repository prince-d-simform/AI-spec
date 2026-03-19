import Ionicons from '@expo/vector-icons/Ionicons';
import React, { memo } from 'react';
import { View } from 'react-native';
import { Text } from '../../../components';
import { useTheme } from '../../../hooks';
import { Colors, scale } from '../../../theme';
import styleSheet from './ProfileInfoCardStyles';
import type { ProfileInfoCardProps } from './ProfileInfoCardTypes';

/**
 *
 * @param param0
 * @returns
 */
const ProfileInfoCardComponent = ({
  label,
  value,
  placeholder,
  iconName
}: ProfileInfoCardProps) => {
  const { styles, theme } = useTheme(styleSheet);

  return (
    <View style={styles.container}>
      {iconName ? (
        <View style={styles.iconWrap}>
          <Ionicons color={Colors[theme]?.primary} name={iconName} size={scale(20)} />
        </View>
      ) : null}
      <View style={styles.wrapper}>
        <Text style={styles.label} variant="bodyRegular12">
          {label}
        </Text>
        <Text
          style={value ? styles.value : styles.placeholder}
          variant={value ? 'bodySemiBold16' : 'bodyRegular14'}
          numberOfLines={2}
        >
          {value || placeholder}
        </Text>
      </View>
    </View>
  );
};

const ProfileInfoCard = memo(ProfileInfoCardComponent);
ProfileInfoCard.displayName = 'ProfileInfoCard';

export default ProfileInfoCard;
