import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

import type { CommonServerOptions } from 'vite'

const envDir = resolve(process.cwd(), './env')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir)

  // 开发服务器，基本上只有连测试环境和生产环境的api，基本不会连本地局域网的后端开发机
  const server: CommonServerOptions = {
    port: 8080,
    // open: true,
    // cors: true,
    host: '0.0.0.0',
    proxy: {
      [env.VITE_API_BASE_URL]: {
        target: env.VITE_PROXY_API_HOST,
        changeOrigin: true,
        headers: {
          Referer: env.VITE_PROXY_API_HOST
        }
        // secure: false
      }
    }
    // https: true
  }

  return {
    envDir,
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        // resolvers: [
        //   TDesignResolver({
        //     library: 'vue-next',
        //     importStyle: true,
        //     resolveIcons: true
        //   })
        // ],
        imports: ['vue'],
        dts: false // 使用静态编写好的类型，不自动生成
      }),
      Components({
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
            importStyle: true,
            resolveIcons: true
          })
        ],
        dts: false // 使用静态编写好的类型，不自动生成
      })
      // monacoEditorPlugin
    ],
    // build: {
    //   outDir: 'dist', // 指定打包路径，默认为项目根目录下的 dist 目录
    //   // terserOptions: {
    //   //   compress: {
    //   //     keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
    //   //     drop_console: true, // 生产环境去除 console
    //   //     drop_debugger: true // 生产环境去除 debugger
    //   //   }
    //   // },
    //   chunkSizeWarningLimit: 1500, // chunk 大小警告的限制（以 kbs 为单位）
    // },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src') // 设置 `@` 指向 `src` 目录
      }
    },
    // base: './', // 会影响打包后html中各种url的前缀
    server,
    css: {
      // postcss: {  },
      preprocessorOptions: {
        scss: {
          // 这个scss文件会被import到所有组件中
          additionalData: '@import "@/common/style/variables.scss";'
        }
      }
      // modules: false
    }
  }
})
