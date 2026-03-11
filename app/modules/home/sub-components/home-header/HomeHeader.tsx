import React, { memo, useMemo, type FC } from 'react';
import { View, type ViewStyle } from 'react-native';
import { Text } from '../../../../components';
import { Strings } from '../../../../constants';
import { useStatusBarHeight, useTheme } from '../../../../hooks';
import styleSheet, { HOME_HEADER_BASE_PADDING_TOP } from './HomeHeaderStyles';
import type { HomeHeaderLayoutMetrics, HomeHeaderProps } from './HomeHeaderTypes';

/**
 * Branded greeting header displayed at the top of the Home screen.
 * Cosmetic only — no navigation controls.
 * All strings sourced from Strings.Home (Constitution V).
 */
const HomeHeader: FC<HomeHeaderProps> = () => {
  const { styles } = useTheme(styleSheet);
  const topInset = useStatusBarHeight();
  const headerLayout = useMemo<HomeHeaderLayoutMetrics>(() => {
    const safeTopInset = Math.max(topInset, 0);

    return {
      basePaddingTop: HOME_HEADER_BASE_PADDING_TOP,
      effectivePaddingTop: HOME_HEADER_BASE_PADDING_TOP + safeTopInset,
      topInset: safeTopInset
    };
  }, [topInset]);
  const containerStyle = useMemo<ViewStyle>(
    () => ({ paddingTop: headerLayout.effectivePaddingTop }),
    [headerLayout.effectivePaddingTop]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{Strings.Home.discoverProducts}</Text>
      <Text style={styles.subtitle}>{Strings.Home.findSomething}</Text>
    </View>
  );
};

export default memo(HomeHeader);
