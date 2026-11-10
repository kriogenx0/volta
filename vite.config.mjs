import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Two builds of the library, from the same source:
// - the default (`npm run build`): components/compiled/components.js, one script
//   that injects its own CSS;
// - `--mode bundle` (`make bundle`): components/compiled/bundle/bundle.js and
//   bundle.css, for a page that loads them as two files (docs/features/bundle.md).
export default defineConfig(({ mode }) => {
  const standalone = mode === 'bundle';

  return {
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
      // matches the previous webpack build's style-loader behavior. The
      // standalone bundle leaves it out, so Vite writes the CSS to its own file.
      ...(standalone ? [] : [cssInjectedByJsPlugin()])
    ],
    // Vite's library mode leaves `process.env.NODE_ENV` for the consumer's bundler to
    // replace, which is right for an app that bundles the library. A page that loads
    // bundle.js with a <script> tag has no bundler and no `process`, so the standalone
    // bundle has it replaced here (as production, which also drops the development-only
    // checks of the libraries inside it).
    define: standalone ? { 'process.env.NODE_ENV': JSON.stringify('production') } : {},
    // `public/` is copied into the output folder by default, which would put a stray
    // styleguide build next to the two bundle files.
    ...(standalone ? { publicDir: false } : {}),
    build: {
      // The bundle sits inside components/compiled, which is git-ignored (and
      // which the default build empties).
      outDir: standalone ? 'components/compiled/bundle' : 'components/compiled',
      emptyOutDir: true,
      lib: {
        entry: resolve(__dirname, 'components/index.js'),
        name: 'volta',
        formats: ['umd'],
        fileName: () => (standalone ? 'bundle.js' : 'components.js'),
        // Only used when the CSS is written to a file, as in the standalone bundle
        cssFileName: 'bundle'
      },
      rollupOptions: {
        // `react-dom/client` (ToastMessage's createRoot) must stay external too: bundled,
        // it would pull in a CommonJS copy of react-dom that `require`s React at load.
        external: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-dom/client': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM'
          }
        }
      }
    },
    resolve: {
      extensions: ['.jsx', '.js']
    }
  };
});
