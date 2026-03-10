import Ionicons from '@expo/vector-icons/Ionicons';
import React, { type FC, useMemo } from 'react';
import { View } from 'react-native';
import { CustomHeader, Text } from '../../components';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import { Colors, scale } from '../../theme';
import styleSheet from './ProfileStyles';
import type { ProfileLandingContent } from './ProfileTypes';

/**
 * Profile tab landing screen.
 * @returns {React.ReactElement} The rendered Profile tab screen.
 */
const ProfileScreen: FC = (): React.ReactElement => {
  const { styles, theme } = useTheme(styleSheet);

  const landingContent = useMemo<ProfileLandingContent>(
    () => ({
      iconName: 'person-circle-outline',
      message: Strings.Profile.emptyMessage,
      title: Strings.Profile.emptyTitle
    }),
    []
  );

  return (
    <View style={styles.screen}>
      <CustomHeader title={Strings.Profile.screenTitle} />
      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons
              color={Colors[theme]?.primary}
              name={landingContent.iconName}
              size={scale(42)}
            />
          </View>
          <Text style={styles.title}>{landingContent.title}</Text>
          <Text style={styles.message}>{landingContent.message}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
ProfileScreen.displayName = 'ProfileScreen';
