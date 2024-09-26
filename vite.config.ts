import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4523/m1/5195488-4861351-default',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/avator':{
        target:'https://sm.ms/api/v2/upload',
        changeOrigin:true,
        rewrite:(path) => path.replace(/^\/api/,'')
      }
    },
  }
})
