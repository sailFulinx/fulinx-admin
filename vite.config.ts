import { resolve } from 'node:path'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { loadEnv } from 'vite'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import ServerUrlCopy from 'vite-plugin-url-copy'
import vueDevTools from 'vite-plugin-vue-devtools'
import type { ConfigEnv, UserConfig } from 'vite'

// https://vitejs.dev/config/
const root = process.cwd()

function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

/** @type {import('vite').UserConfig} */
export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any
  const isBuild = command === 'build'
  if (!isBuild) {
    env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
  } else {
    env = loadEnv(mode, root)
  }
  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      UnoCSS(),
      ServerUrlCopy(),
      Vue(),
      Components({
        dts: 'src/components.d.ts',
      }),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [{
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: name => {
            return `element-plus/es/components/${name.substring(3)}/style/css`
          },
        }],
      }),
      VueI18nPlugin({
        runtimeOnly: true,
        compositionOnly: true,
        include: [resolve(__dirname, 'src/locales/**')],
      }),
      createSvgIconsPlugin({
        iconDirs: [pathResolve('src/assets/svgs')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: true,
      }),
      DefineOptions(),
      vueDevTools(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        imports: ['vue', 'vue-router'],
        dirs: ['./src/composables'],
        dts: 'src/auto-imports.d.ts',
      }),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
      alias: {
        '@': resolve('./src'),
      },
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true',
        },
      },
    },
    server: {
      port: 4001,
      proxy: {
        // 选项写法
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
      hmr: {
        overlay: false,
      },
      host: '0.0.0.0',
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'vue-types',
        'element-plus/es/locale/lang/zh-cn',
        'element-plus/es/locale/lang/en',
        '@iconify/iconify',
        'axios',
        'qs',
        'echarts',
        '@wangeditor/editor',
        '@wangeditor/editor-for-vue',
      ],
    },
  }
}
