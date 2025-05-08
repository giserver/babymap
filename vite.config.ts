import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [vue(), dts({ 'include': "lib" })],
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'BabyMap',
      fileName: 'index',
    },

    rollupOptions: {
      external: ["vue", "@babylonjs/core", "@babylonjs/loaders", "mapbox-gl", "maplibre-gl"]
    }
  },
})
