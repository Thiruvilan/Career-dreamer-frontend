import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    ignores: ["**/.next/**", "**/dist/**", "**/build/**", "**/out/**", "**/coverage/**"],
  },
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020,
      sourceType: "module",
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
];


