import baseConfig, { restrictEnvAccess } from "@hh/eslint-config/base";
import nextjsConfig from "@hh/eslint-config/nextjs";
import reactConfig from "@hh/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
