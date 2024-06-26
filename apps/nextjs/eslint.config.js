import baseConfig, { restrictEnvAccess } from "@shc/eslint-config/base";
import nextjsConfig from "@shc/eslint-config/nextjs";
import reactConfig from "@shc/eslint-config/react";

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
