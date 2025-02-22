import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

export default [
    eslint.configs.recommended,
    {
        languageOptions: {
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "react": react,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
            "import": importPlugin,
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/jsx-filename-extension": ["error", { "extensions": [".tsx", ".jsx"] }],
            "import/extensions": ["error", "ignorePackages", { "ts": "never", "tsx": "never" }],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "no-console": "warn",
            "no-unused-vars": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "jsx-a11y/anchor-is-valid": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                },
            },
        },
        ignores: ["node_modules", "dist", "build", "public"],
    },
];
