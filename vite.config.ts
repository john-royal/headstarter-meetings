import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: false },
    },
  },
  plugins: [react(), tsconfigPaths()],
});
