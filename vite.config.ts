import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/src/components/ScreenSaaSConsole')) return 'screen-saas';
            if (id.includes('/src/components/ScreenCartaSede')) return 'screen-carta';
            if (id.includes('/src/components/ScreenAdminDashboard')) return 'screen-dashboard';
            if (id.includes('/src/components/ScreenCocinaKDS')) return 'screen-kds';
            if (id.includes('/src/components/ScreenTomarPedido') || id.includes('/src/components/ScreenCuentaCobro') || id.includes('/src/components/ScreenMesas')) return 'screen-operacion';
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('@firebase/auth') || id.includes('firebase/auth')) return 'firebase-auth';
            if (id.includes('@firebase/firestore') || id.includes('firebase/firestore')) return 'firebase-firestore';
            if (id.includes('@firebase/database') || id.includes('firebase/database')) return 'firebase-database';
            if (id.includes('@firebase/app') || id.includes('firebase/app')) return 'firebase-core';
            if (id.includes('firebase')) return 'firebase-core';
            if (id.includes('react') || id.includes('scheduler')) return 'react-vendor';
            if (id.includes('lucide-react')) return 'icons';
            return 'vendor';
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:10019',
          changeOrigin: true,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
