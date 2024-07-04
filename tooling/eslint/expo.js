import { fixupPluginRules } from "@eslint/compat";
// @ts-ignore
import testingLibrary from "eslint-plugin-testing-library";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.test.{js,ts,jsx,tsx}"],
    plugins: {
      "testing-library": fixupPluginRules({
        rules: testingLibrary.rules,
      }),
    },
    rules: testingLibrary.configs.react.rules,
  },
];

// @link https://github.com/testing-library/eslint-plugin-testing-library/issues/899

// @link https://github.com/testing-library/eslint-plugin-testing-library/issues/900

// @link https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config
