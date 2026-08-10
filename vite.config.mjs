import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      // A handful of legacy files (util/formats, util/messages) use Flow
      // type annotations, which esbuild can't parse. Adding
      // @babel/preset-flow makes Babel (already used for JSX) strip them.
      babel: {
        presets: ['@babel/preset-flow']
      }
    }),
    // Every component's CSS is injected on import (a self-contained
    // <script> drop-in, no separate stylesheet to remember to link) --
    // matches the previous webpack build's style-loader behavior.
    cssInjectedByJsPlugin(),
    // TinyMCE self-hosts as static assets loaded via <script>, not an ES
    // import -- RichTextTinyMCE points tinymceScriptSrc at this copy.
    viteStaticCopy({
      targets: [
        { src: 'node_modules/tinymce/*', dest: 'tinymce' }
      ]
    })
  ],
  build: {
    outDir: 'components/compiled',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'components/index.js'),
      name: 'volta',
      formats: ['umd'],
      fileName: () => 'components.js'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM'
        }
      }
    }
  },
  resolve: {
    extensions: ['.jsx', '.js']
  }
});
