import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['@babel/plugin-proposal-decorators', { version: '2023-05' }]]
      }
    }),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json'
      },
      eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"', useFlatConfig: true }
    })
  ]
});
