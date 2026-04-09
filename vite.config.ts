import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    base: '/',
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-framer':   ['framer-motion', 'motion'],
            'vendor-leaflet':  ['leaflet', 'react-leaflet'],
            'vendor-gemini':   ['@google/generative-ai'],
            'vendor-pdf':      ['jspdf', 'html2canvas'],
            'chunk-admin':     [
              './src/components/AdminDashboard',
              './src/components/AdminAI_Assistant',
              './src/components/SuperAdminDashboard',
            ],
          },
        },
      },
    },
  };
});
