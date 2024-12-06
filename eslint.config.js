import eslintEzzePrettierConfig from 'eslint-config-ezze-prettier';
import eslintEzzeTypeScriptConfig from 'eslint-config-ezze-ts';
import eslintReactHooksPlugin from 'eslint-plugin-react-hooks';
import eslintReactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    ignores: ['dist', 'node_modules'],
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
  ...eslintEzzeTypeScriptConfig,
  ...eslintEzzePrettierConfig
];
