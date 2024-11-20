import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import';
import jsPlugin from '@stylistic/eslint-plugin-js';
import tsPlugin from '@stylistic/eslint-plugin-ts';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin,
      '@stylistic/js': jsPlugin,
      '@stylistic/ts': tsPlugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'always',
          'alphabetize': {
            'caseInsensitive': true,
            'order': 'asc'
          }
        }
      ],
      '@stylistic/js/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/js/array-bracket-spacing': ['error', 'never'],
      '@stylistic/js/array-element-newline': ['error', 'consistent'],
      '@stylistic/js/arrow-parens': 'error',
      '@stylistic/js/arrow-spacing': ['error', { 'before': true, 'after': true }],
      '@stylistic/js/dot-location': ['error', 'property'],
      '@stylistic/js/eol-last': 'error',
      '@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/js/implicit-arrow-linebreak': ['error', 'beside'],
      '@stylistic/js/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/max-len': ['error', 120],
      '@stylistic/js/no-extra-parens': ['error', 'functions'],
      '@stylistic/js/no-extra-semi': 'error',
      '@stylistic/js/no-mixed-operators': [
        'error', {
          'groups': [
            ['&', '|', '^', '~', '<<', '>>', '>>>'],
            ['&&', '||']
          ]
        }
      ],
      '@stylistic/js/no-multi-spaces': 'error',
      '@stylistic/js/no-multiple-empty-lines': ['error', { 'max': 1, 'maxBOF': 0, 'maxEOF': 0 }],
      '@stylistic/js/no-tabs': 'error',
      '@stylistic/js/no-trailing-spaces': 'error',
      '@stylistic/js/no-whitespace-before-property': 'error',
      '@stylistic/js/operator-linebreak': ['error', 'after'],
      '@stylistic/js/quote-props': ['error', 'as-needed'],
      '@stylistic/js/rest-spread-spacing': ['error', 'never'],
      '@stylistic/js/semi-spacing': ['error', { 'before': false, 'after': true }],
      '@stylistic/js/space-before-blocks': 'error',
      '@stylistic/js/space-in-parens': ['error', 'never'],
      '@stylistic/js/spaced-comment': 'error',
      '@stylistic/ts/block-spacing': 'error',
      '@stylistic/ts/brace-style': ['error', '1tbs'],
      '@stylistic/ts/comma-dangle': ['error', 'never'],
      '@stylistic/ts/comma-spacing': ['error', { 'before': false, 'after': true }],
      '@stylistic/ts/function-call-spacing': ['error', 'never'],
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/key-spacing': ['error', { 'mode': 'strict', 'beforeColon': false, 'afterColon': true }],
      '@stylistic/ts/keyword-spacing': ['error', { 'before': true, 'after': true }],
      '@stylistic/ts/lines-between-class-members': [
        'error', {
          'enforce': [
            { 'blankLine': 'always', 'prev': '*', 'next': 'method' },
            { 'blankLine': 'always', 'prev': 'method', 'next': '*' }
          ]
        }
      ],
      '@stylistic/ts/object-curly-spacing': ['error', 'always', { 'arraysInObjects': true, 'objectsInObjects': true }],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/semi': ['error', 'always'],
      '@stylistic/ts/space-before-blocks': 'error',
      '@stylistic/ts/space-before-function-paren': ['error', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
      }],
      '@stylistic/ts/space-infix-ops': ['error', { 'int32Hint': true }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    },
  },
)
