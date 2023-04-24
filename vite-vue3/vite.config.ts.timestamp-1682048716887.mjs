// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/project/mcp-web/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/project/mcp-web/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/project/mcp-web/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/project/mcp-web/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/project/mcp-web/node_modules/unplugin-vue-components/dist/vite.mjs";
import { TDesignResolver } from "file:///D:/project/mcp-web/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "D:\\project\\mcp-web";
var envDir = resolve(process.cwd(), "./env");
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir);
  const server = {
    port: 8080,
    // open: true,
    // cors: true,
    host: "0.0.0.0",
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
  };
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
        imports: ["vue"],
        dts: false
        // 使用静态编写好的类型，不自动生成
      }),
      Components({
        resolvers: [
          TDesignResolver({
            library: "vue-next",
            importStyle: true,
            resolveIcons: true
          })
        ],
        dts: false
        // 使用静态编写好的类型，不自动生成
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
        "@": resolve(__vite_injected_original_dirname, "./src")
        // 设置 `@` 指向 `src` 目录
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
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXG1jcC13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RcXFxcbWNwLXdlYlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdC9tY3Atd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IFREZXNpZ25SZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgdHlwZSB7IENvbW1vblNlcnZlck9wdGlvbnMgfSBmcm9tICd2aXRlJ1xuXG5jb25zdCBlbnZEaXIgPSByZXNvbHZlKHByb2Nlc3MuY3dkKCksICcuL2VudicpXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBlbnZEaXIpXG5cbiAgLy8gXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHVGRjBDXHU1N0ZBXHU2NzJDXHU0RTBBXHU1M0VBXHU2NzA5XHU4RkRFXHU2RDRCXHU4QkQ1XHU3M0FGXHU1ODgzXHU1NDhDXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU3Njg0YXBpXHVGRjBDXHU1N0ZBXHU2NzJDXHU0RTBEXHU0RjFBXHU4RkRFXHU2NzJDXHU1NzMwXHU1QzQwXHU1N0RGXHU3RjUxXHU3Njg0XHU1NDBFXHU3QUVGXHU1RjAwXHU1M0QxXHU2NzNBXG4gIGNvbnN0IHNlcnZlcjogQ29tbW9uU2VydmVyT3B0aW9ucyA9IHtcbiAgICBwb3J0OiA4MDgwLFxuICAgIC8vIG9wZW46IHRydWUsXG4gICAgLy8gY29yczogdHJ1ZSxcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgcHJveHk6IHtcbiAgICAgIFtlbnYuVklURV9BUElfQkFTRV9VUkxdOiB7XG4gICAgICAgIHRhcmdldDogZW52LlZJVEVfUFJPWFlfQVBJX0hPU1QsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIFJlZmVyZXI6IGVudi5WSVRFX1BST1hZX0FQSV9IT1NUXG4gICAgICAgIH1cbiAgICAgICAgLy8gc2VjdXJlOiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBodHRwczogdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbnZEaXIsXG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKCksXG4gICAgICB2dWVKc3goKSxcbiAgICAgIEF1dG9JbXBvcnQoe1xuICAgICAgICAvLyByZXNvbHZlcnM6IFtcbiAgICAgICAgLy8gICBURGVzaWduUmVzb2x2ZXIoe1xuICAgICAgICAvLyAgICAgbGlicmFyeTogJ3Z1ZS1uZXh0JyxcbiAgICAgICAgLy8gICAgIGltcG9ydFN0eWxlOiB0cnVlLFxuICAgICAgICAvLyAgICAgcmVzb2x2ZUljb25zOiB0cnVlXG4gICAgICAgIC8vICAgfSlcbiAgICAgICAgLy8gXSxcbiAgICAgICAgaW1wb3J0czogWyd2dWUnXSxcbiAgICAgICAgZHRzOiBmYWxzZSAvLyBcdTRGN0ZcdTc1MjhcdTk3NTlcdTYwMDFcdTdGMTZcdTUxOTlcdTU5N0RcdTc2ODRcdTdDN0JcdTU3OEJcdUZGMENcdTRFMERcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcbiAgICAgIH0pLFxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAgIFREZXNpZ25SZXNvbHZlcih7XG4gICAgICAgICAgICBsaWJyYXJ5OiAndnVlLW5leHQnLFxuICAgICAgICAgICAgaW1wb3J0U3R5bGU6IHRydWUsXG4gICAgICAgICAgICByZXNvbHZlSWNvbnM6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICBdLFxuICAgICAgICBkdHM6IGZhbHNlIC8vIFx1NEY3Rlx1NzUyOFx1OTc1OVx1NjAwMVx1N0YxNlx1NTE5OVx1NTk3RFx1NzY4NFx1N0M3Qlx1NTc4Qlx1RkYwQ1x1NEUwRFx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFxuICAgICAgfSlcbiAgICAgIC8vIG1vbmFjb0VkaXRvclBsdWdpblxuICAgIF0sXG4gICAgLy8gYnVpbGQ6IHtcbiAgICAvLyAgIG91dERpcjogJ2Rpc3QnLCAvLyBcdTYzMDdcdTVCOUFcdTYyNTNcdTUzMDVcdThERUZcdTVGODRcdUZGMENcdTlFRDhcdThCQTRcdTRFM0FcdTk4NzlcdTc2RUVcdTY4MzlcdTc2RUVcdTVGNTVcdTRFMEJcdTc2ODQgZGlzdCBcdTc2RUVcdTVGNTVcbiAgICAvLyAgIC8vIHRlcnNlck9wdGlvbnM6IHtcbiAgICAvLyAgIC8vICAgY29tcHJlc3M6IHtcbiAgICAvLyAgIC8vICAgICBrZWVwX2luZmluaXR5OiB0cnVlLCAvLyBcdTk2MzJcdTZCNjIgSW5maW5pdHkgXHU4OEFCXHU1MzhCXHU3RjI5XHU2MjEwIDEvMFx1RkYwQ1x1OEZEOVx1NTNFRlx1ODBGRFx1NEYxQVx1NUJGQ1x1ODFGNCBDaHJvbWUgXHU0RTBBXHU3Njg0XHU2MDI3XHU4MEZEXHU5NUVFXHU5ODk4XG4gICAgLy8gICAvLyAgICAgZHJvcF9jb25zb2xlOiB0cnVlLCAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTUzQkJcdTk2NjQgY29uc29sZVxuICAgIC8vICAgLy8gICAgIGRyb3BfZGVidWdnZXI6IHRydWUgLy8gXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU1M0JCXHU5NjY0IGRlYnVnZ2VyXG4gICAgLy8gICAvLyAgIH1cbiAgICAvLyAgIC8vIH0sXG4gICAgLy8gICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDE1MDAsIC8vIGNodW5rIFx1NTkyN1x1NUMwRlx1OEI2Nlx1NTQ0QVx1NzY4NFx1OTY1MFx1NTIzNlx1RkYwOFx1NEVFNSBrYnMgXHU0RTNBXHU1MzU1XHU0RjREXHVGRjA5XG4gICAgLy8gfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSAvLyBcdThCQkVcdTdGNkUgYEBgIFx1NjMwN1x1NTQxMSBgc3JjYCBcdTc2RUVcdTVGNTVcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIGJhc2U6ICcuLycsIC8vIFx1NEYxQVx1NUY3MVx1NTRDRFx1NjI1M1x1NTMwNVx1NTQwRWh0bWxcdTRFMkRcdTU0MDRcdTc5Q0R1cmxcdTc2ODRcdTUyNERcdTdGMDBcbiAgICBzZXJ2ZXIsXG4gICAgY3NzOiB7XG4gICAgICAvLyBwb3N0Y3NzOiB7ICB9LFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgLy8gXHU4RkQ5XHU0RTJBc2Nzc1x1NjU4N1x1NEVGNlx1NEYxQVx1ODhBQmltcG9ydFx1NTIzMFx1NjI0MFx1NjcwOVx1N0VDNFx1NEVGNlx1NEUyRFxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnQGltcG9ydCBcIkAvY29tbW9uL3N0eWxlL3ZhcmlhYmxlcy5zY3NzXCI7J1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBtb2R1bGVzOiBmYWxzZVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOE8sU0FBUyxjQUFjLGVBQWU7QUFDcFIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUVuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLHVCQUF1QjtBQUNoQyxTQUFTLGVBQWU7QUFQeEIsSUFBTSxtQ0FBbUM7QUFXekMsSUFBTSxTQUFTLFFBQVEsUUFBUSxJQUFJLEdBQUcsT0FBTztBQUU3QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLE1BQU07QUFHaEMsUUFBTSxTQUE4QjtBQUFBLElBQ2xDLE1BQU07QUFBQTtBQUFBO0FBQUEsSUFHTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxDQUFDLElBQUksaUJBQWlCLEdBQUc7QUFBQSxRQUN2QixRQUFRLElBQUk7QUFBQSxRQUNaLGNBQWM7QUFBQSxRQUNkLFNBQVM7QUFBQSxVQUNQLFNBQVMsSUFBSTtBQUFBLFFBQ2Y7QUFBQTtBQUFBLE1BRUY7QUFBQSxJQUNGO0FBQUE7QUFBQSxFQUVGO0FBRUEsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLE9BQU87QUFBQSxNQUNQLFdBQVc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBUVQsU0FBUyxDQUFDLEtBQUs7QUFBQSxRQUNmLEtBQUs7QUFBQTtBQUFBLE1BQ1AsQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBQ1QsV0FBVztBQUFBLFVBQ1QsZ0JBQWdCO0FBQUEsWUFDZCxTQUFTO0FBQUEsWUFDVCxhQUFhO0FBQUEsWUFDYixjQUFjO0FBQUEsVUFDaEIsQ0FBQztBQUFBLFFBQ0g7QUFBQSxRQUNBLEtBQUs7QUFBQTtBQUFBLE1BQ1AsQ0FBQztBQUFBO0FBQUEsSUFFSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVlBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUE7QUFBQSxNQUNqQztBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUE7QUFBQSxJQUNBLEtBQUs7QUFBQTtBQUFBLE1BRUgscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBO0FBQUEsVUFFSixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFBQTtBQUFBLElBRUY7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
