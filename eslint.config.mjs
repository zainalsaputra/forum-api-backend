import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginJSDoc from "eslint-plugin-jsdoc"; // Import the jsdoc plugin

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" }
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest }
    }
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      jsdoc: eslintPluginJSDoc, // Pass the plugin object here
    },
    rules: {
      "no-unused-vars": "off", // Customize rules as needed
      "jsdoc/require-jsdoc": "off", // Disable the require-jsdoc rule if not needed
      "jsdoc/valid-jsdoc": "off",  // Disable the valid-jsdoc rule if not needed
    }
  }
];
