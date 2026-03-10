import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  type NavigatorScreenParams,
  type RouteProp
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { AppEnvConst, ROUTES, Strings } from '../constants';
import { useTheme } from '../hooks';
import { DetailsScreen, HomeScreen, SigninScreen } from '../modules';
import { CartScreen } from '../modules/cart';
import { ProfileScreen } from '../modules/profile';
import { Colors, scale } from '../theme';
import { getLinkConfiguration, navigationRef } from '../utils';

/**
 * The type of the navigation prop for the RootStack.
 * @typedef {object} RootStackParamList is an object type with keys that are the route names
 * and values that are the route params
 * @property {undefined} [RootMain] - The root main tab shell.
 * @property {undefined} [Details] - The Details screen.
 * @property {undefined} [SignIn] - The SignIn screen.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type MainTabParamList = {
  [ROUTES.Home]: undefined;
  [ROUTES.Cart]: undefined;
  [ROUTES.Profile]: undefined;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStackParamList = {
  [ROUTES.RootMain]: NavigatorScreenParams<MainTabParamList> | undefined;
  [ROUTES.Details]: { id: string };
  [ROUTES.SignIn]: undefined;
};

type MainTabRouteProp = RouteProp<MainTabParamList, keyof MainTabParamList>;

/**
 * Creating a stack navigator with the type of RootStackParamList.
 * @returns {StackNavigator} - The root stack navigator.
 */
const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const tabIconMap: Record<
  keyof MainTabParamList,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  [ROUTES.Home]: { active: 'home', inactive: 'home-outline' },
  [ROUTES.Cart]: { active: 'cart', inactive: 'cart-outline' },
  [ROUTES.Profile]: { active: 'person', inactive: 'person-outline' }
};

const tabLabelMap: Record<keyof MainTabParamList, string> = {
  [ROUTES.Home]: Strings.Tabs.homeLabel,
  [ROUTES.Cart]: Strings.Tabs.cartLabel,
  [ROUTES.Profile]: Strings.Tabs.profileLabel
};

/**
 * Initializes the React Navigation DevTools.
 * @returns None
 */
function InitializeReactNavigationDevTools(): void {
  const { useReduxDevToolsExtension } = require('@react-navigation/devtools');
  useReduxDevToolsExtension(navigationRef);
}

/**
 * The primary bottom-tab shell for the app.
 * @returns {React.ReactElement} The configured bottom-tab navigator.
 */
const MainTabNavigator = (): React.ReactElement => {
  const { theme } = useTheme();

  const getTabIcon = useCallback(
    (route: MainTabRouteProp, focused: boolean, color: string, size: number) => {
      const iconName = focused ? tabIconMap[route.name].active : tabIconMap[route.name].inactive;

      return <Ionicons color={color} name={iconName} size={size} />;
    },
    []
  );

  return (
    <MainTab.Navigator
      initialRouteName={ROUTES.Home}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors[theme]?.primary,
        tabBarInactiveTintColor: Colors[theme]?.gray,
        tabBarStyle: {
          backgroundColor: Colors[theme]?.white,
          borderTopColor: Colors[theme]?.chipInactive,
          borderTopWidth: scale(1),
          height: scale(68),
          paddingBottom: scale(8),
          paddingTop: scale(8)
        },
        tabBarLabelStyle: {
          fontSize: scale(11),
          fontWeight: '600'
        },
        tabBarIcon: ({ color, focused, size }) =>
          getTabIcon(route as MainTabRouteProp, focused, color, size),
        tabBarLabel: tabLabelMap[route.name as keyof MainTabParamList]
      })}
    >
      <MainTab.Screen name={ROUTES.Home} component={HomeScreen} />
      <MainTab.Screen name={ROUTES.Cart} component={CartScreen} />
      <MainTab.Screen name={ROUTES.Profile} component={ProfileScreen} />
    </MainTab.Navigator>
  );
};

/**
 * The main App container.
 * @returns {React.ReactNode} The main App container.
 */
const AppContainer = () => {
  const { theme, isDark } = useTheme();
  if (AppEnvConst.isDevelopment) {
    InitializeReactNavigationDevTools();
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={getLinkConfiguration()}
      theme={{
        dark: isDark,
        colors: {
          primary: Colors[theme]?.black,
          background: Colors[theme]?.white,
          card: Colors[theme]?.white,
          text: Colors[theme]?.black,
          border: Colors[theme]?.black,
          notification: Colors[theme]?.white
        }
      }}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name={ROUTES.RootMain} component={MainTabNavigator} />
        <RootStack.Screen name={ROUTES.SignIn} component={SigninScreen} />
        <RootStack.Screen name={ROUTES.Details} component={DetailsScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
