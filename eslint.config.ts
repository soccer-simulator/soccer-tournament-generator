import { ESLint, Linter } from 'eslint';
import eslintEzzePrettier from 'eslint-config-ezze-prettier';
import eslintEzzeTypeScript from 'eslint-config-ezze-ts';
import eslintReactHooksPlugin from 'eslint-plugin-react-hooks';
import eslintReactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';

// eslint-plugin-react-hooks bundles a `configs.flat` shape that isn't assignable to Linter.Plugin,
// so only the fields the flat config actually needs (meta, rules) are registered here
const eslintReactHooksFlatPlugin: ESLint.Plugin = {
  meta: eslintReactHooksPlugin.meta,
  rules: eslintReactHooksPlugin.rules
};

const config: Array<Linter.Config> = [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': eslintReactHooksFlatPlugin,
      'react-refresh': eslintReactRefreshPlugin
    },
    rules: {
      ...eslintReactHooksPlugin.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    }
  },
  ...eslintEzzeTypeScript,
  ...eslintEzzePrettier
];

export default config;
