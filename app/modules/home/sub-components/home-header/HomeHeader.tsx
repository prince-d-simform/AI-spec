import React, { type FC } from 'react';
import { View } from 'react-native';
import { Text } from '../../../../components';
import { Strings } from '../../../../constants';
import { useTheme } from '../../../../hooks';
import styleSheet from './HomeHeaderStyles';
import type { HomeHeaderProps } from './HomeHeaderTypes';

/**
 * Branded greeting header displayed at the top of the Home screen.
 * Cosmetic only — no navigation controls.
 * All strings sourced from Strings.Home (Constitution V).
 */
const HomeHeader: FC<HomeHeaderProps> = () => {
  const { styles } = useTheme(styleSheet);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Strings.Home.discoverProducts}</Text>
      <Text style={styles.subtitle}>{Strings.Home.findSomething}</Text>
    </View>
  );
};

export default HomeHeader;
