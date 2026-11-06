import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'styleguide',
  // Read .env.local from the repository root, not from styleguide/ (see docs/features/map.md).
  envDir: __dirname,
  plugins: [
    react({
      babel: {
        presets: ['@babel/preset-flow']
      }
    }),
    viteStaticCopy({
      targets: [
        { src: '../node_modules/tinymce/*', dest: 'tinymce' }
      ]
    })
  ],
  server: {
    host: true,
    port: 8888,
    open: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    extensions: ['.jsx', '.js']
  }
});
