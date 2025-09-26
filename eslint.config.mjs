import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'out/**',
      '.vercel/**',
      '.turbo/**',
      'coverage/**',
      '.nyc_output/**',
      'public/**',
      '*.min.js',
      '*.bundle.js',
      '.env*',
      '.git/**',
      '.vscode/**',
      '.idea/**',
      'tailwind.config.ts',
      'next.config.js',
      'next.config.mjs',
      'postcss.config.js',
      'jest.config.js',
      'vitest.config.ts',
    ],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': pluginUnusedImports,
      'simple-import-sort': pluginSimpleImportSort,
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-useless-escape': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'simple-import-sort/imports': 'off',
      'simple-import-sort/exports': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react/self-closing-comp': 'off',
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-restricted-imports': ['error', { paths: [] }],
      'no-debugger': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
];

export default eslintConfig;
