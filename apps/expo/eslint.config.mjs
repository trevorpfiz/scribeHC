import baseConfig from "@hh/eslint-config/base";
import reactConfig from "@hh/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
    overrides: [
      {
        // Test files only
        files: [
          "**/__tests__/**/*.[jt]s?(x)",
          "**/?(*.)+(spec|test).[jt]s?(x)",
        ],
        extends: ["plugin:testing-library/react"],
      },
    ],
  },
  ...baseConfig,
  ...reactConfig,
];
