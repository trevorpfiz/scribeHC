import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "scribeHH",
  slug: "scribehh",
  scheme: "expo",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#18181A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.scribehh.app",
    supportsTablet: true,
    usesAppleSignIn: true,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.scribehh.app",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#18181A",
    },
  },
  web: {
    bundler: "metro",
    output: "single",
    favicon: "./assets/favicon.png",
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "4c79936e-b351-4bc9-93bb-390f20e4364f",
    },
  },
  owner: "scribe-hh",
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-apple-authentication",
    "expo-font",
    [
      "expo-build-properties",
      {
        android: {
          minSdkVersion: 24,
          compileSdkVersion: 33,
          targetSdkVersion: 33,
          buildToolsVersion: "33.0.0",
          kotlinVersion: "1.6.20",
        },
        ios: {
          deploymentTarget: "15.0",
        },
      },
    ],
  ],
});
