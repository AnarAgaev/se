import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { analyzer } from 'vite-bundle-analyzer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    analyzer(),
  ],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Убираем hash из имен файлов для entry points
        entryFileNames: `assets/[name].js`,
        // Убираем hash из имен файлов для assets (CSS, изображения и т.д.)
        assetFileNames: `assets/[name].[ext]`,

























        // Убираем hash из имен файлов для динамически загружаемых модулей (chunks)
        chunkFileNames: `assets/[name].js`,
      },
    },
  },
  base: mode === 'production'
    ? 'https://storage.yandexcloud.net/shrunk/se-configurator/front/'
    : '/', // Для development используем относительный путь
}));
