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
  },


  // proxy: {
  //   '/': { // 匹配请求路径，localhost:3000/snow
  //     target: 'http://39.101.77.127', // 代理的目标地址
  //     changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:3000 代理服务会把origin修改为目标地址
  //     // secure: true, // 是否https接口
  //     // ws: true, // 是否代理websockets
  //     // rewrite target目标地址 + '/abc'，如果接口是这样的，那么不用重写
  //     // rewrite: (path) => path.replace(/^\/snow/, '') // 路径重写，本项目不需要重写
  //   }
  // }
})
