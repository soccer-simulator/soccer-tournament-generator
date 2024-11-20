import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['@babel/plugin-proposal-decorators', { version: '2023-05' }]]
      }
    })
  ]
});
