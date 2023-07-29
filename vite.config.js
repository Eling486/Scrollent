// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('./src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Scrollent',
      format: ['es', 'cjs', 'umd'],
      fileName: 'scrollent',
    },
    rollupOptions: {
      external: ['SCROLLENT_VERSION'],
      output: {
        globals: {
          SCROLLENT_VERSION: `"${require('./package.json').version}"`,
        },
        assetFileNames: 'scrollent.[ext]'
      },
    },
  },
  plugins: [
    cssInjectedByJs({
      styleId: "scrollent"
    }),
    viteCompression(),
  ],
})