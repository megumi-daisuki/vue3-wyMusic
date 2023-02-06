import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 自动引入饿了么组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({

  base: './',


  plugins: [vue(),
  AutoImport({
    resolvers: [
      ElementPlusResolver(),
      /*  IconsResolver({ prefix: 'Icon', }) */
    ],
  }),
  Components({
    resolvers: [
      ElementPlusResolver(),
      /* IconsResolver({
        enabledCollections: ['ep'],
      }), */
    ],
  }),
    /* Icons({
      autoInstall: true,
    }), */
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
