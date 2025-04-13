import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE,
          changeOrigin: true,
          secure: false,
        },
      },
      allowedHosts: ['challenge-9a-frontend.onrender.com'],
    },
  };
});
