import { defineProGuardRules, getEnvironmentConfig } from './buildconfig';

/* eslint-disable require-jsdoc */
const defineConfig = ({ config }) => {
  let APP_ENV = process.env.NODE_ENV;

  const { appName, bundleIdentifier } = getEnvironmentConfig(APP_ENV);

  return {
    ...config,
    name: appName,
    slug: 'AiSpec',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './app/assets/icons/appIcon.png',
    scheme: 'AiSpec',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './app/assets/images/splashScreen.png',
      resizeMode: 'contain'
    },
    ios: {
      
      bundleIdentifier: 'com.simform.aispec',
      infoPlist: {
        NSCameraUsageDescription: 'This app requires to access your photo library'
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './app/assets/icons/adaptiveIcon.png',
        backgroundColor: '#ffffff'
      },
       
      package: 'com.simform.aispec',
      permissions: ['CAMERA']
    },
    web: {
      bundler: 'metro',
      output: 'static'
    },
    plugins: [
      'expo-localization',
      'expo-asset',
      'expo-font',
      'expo-router',
      [
        'expo-build-properties',
        {
          android: {
            minSdkVersion: 30,
            enableProguardInReleaseBuilds: true,
            extraProguardRules: defineProGuardRules(bundleIdentifier)
          },
          ios: {
            deploymentTarget: '16.0'
          }
        }
      ],
      [
        'react-native-permissions',
        {
          iosPermissions: ['Camera']
        }
      ]
      ,
      ["./withCustomSigning"]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      
    }
  };
};

export default defineConfig;
