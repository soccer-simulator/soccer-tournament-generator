import { Linter } from 'eslint';
import eslintEzzePrettier from 'eslint-config-ezze-prettier';
import eslintEzzeTypeScript from 'eslint-config-ezze-ts';
import eslintReactHooksPlugin from 'eslint-plugin-react-hooks';
import eslintReactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';

const config: Array<Linter.Config> = [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': eslintReactHooksPlugin,
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
