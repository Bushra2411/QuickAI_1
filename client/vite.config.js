/*import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss(),],
  resolve: {
    alias: {
      crypto: 'node:crypto'
    }
  }
});*/



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      crypto: 'node:crypto'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // your backend server
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
