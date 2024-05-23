import baseConfig from "@hh/eslint-config/base";
import reactConfig from "@hh/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
