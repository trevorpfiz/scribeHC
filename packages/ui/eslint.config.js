import baseConfig from "@shc/eslint-config/base";
import reactConfig from "@shc/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
