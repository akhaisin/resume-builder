import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import path from 'path'

export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      // The unbundled TypstDocument.js references ./typst.css?inline which was
      // never shipped. Use the pre-bundled .mjs that has the CSS inlined.
      '@myriaddreamin/typst.react': path.resolve(
        'node_modules/@myriaddreamin/typst.react/dist/typst.react.mjs',
      ),
    },
  },
  optimizeDeps: {
    exclude: [
      '@myriaddreamin/typst.ts',
      '@myriaddreamin/typst-ts-web-compiler',
      '@myriaddreamin/typst.react',
    ],
  },
})
