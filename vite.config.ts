import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/'],
      extension: ['.js', '.ts', '.jsx', '.tsx'],
      requireEnv: false,
    }),
  ],
  server: {
    port: Number(process.env.PORT) || 5174,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
