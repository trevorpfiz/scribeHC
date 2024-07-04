import baseConfig from "@shc/eslint-config/base";
import expoConfig from "@shc/eslint-config/expo";
import reactConfig from "@shc/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...expoConfig,
];
