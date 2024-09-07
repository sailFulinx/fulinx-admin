import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { useShortcuts } from 'unoist'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    // presetForms(),
    presetTypography(),
    presetWebFonts({
      // provider: 'bunny',
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
        caveat: 'Caveat',
        nunito: ['Nunito'],
      },
    }),
  ],
  shortcuts: [
    {
      'drag-none': 'pointer-events-none select-none',
      'box': 'container mx-auto md:px-10 px-4 lg:max-w-100% md:max-w-100%',
      'card-pd': 'p-5 sm:p-8',
      'card-bg': 'bg-light-300 dark:bg-dark-600',
      'card': 'rounded-lg shadow card-pd card-bg',
    },
    {
      'btn': 'rounded ring-0 select-none cursor-pointer transition-180 leading-1em',
      'btn-hover': 'dark:hover:bg-bluegray-4/30 hover:bg-gray-2 hover:c-primary-light',
      'icon-btn': 'btn flex-center p-5px btn-hover',
      's-icon': ' items-center gap-4px',
      'btn-base': 'flex-inline px-8px py-6px vertical-middle',
      't-btn': 'btn btn-hover btn-base', // text btn
      'p-btn-base': 'btn btn-base c-light-1',
      'p-btn': 'bg-primary  hover:bg-primary-light p-btn-base', // primary btn
      'p-btn-success': 'bg-success  hover:bg-success/90 p-btn-base', // primary danger btn
      'p-btn-danger': 'bg-danger  hover:bg-danger/90 p-btn-base', // primary danger btn
      'p-btn-warning': 'bg-warning  hover:bg-warning/90 p-btn-base', // primary danger btn
    },
    {
      'feed-box': 'md:mx-auto lg:max-w-4xl md:max-w-3xl',
    },
    ...useShortcuts(),
  ],
  theme: {
    colors: {
      primary: '#4D9375',
      primaryLight: '#4D9375',
      success: '#67c23a',
      warning: '#ffb400',
      danger: '#f53f3f',
    },
    fontFamily: {
      MiSans: 'MiSans',
    },
    breakpoints: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1360px',
      'xxl': '1360px',
      '3xl': '1536px',
      'xxxl': '1536px',
    },
  },
  autocomplete: {
    templates: ['fs-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)'],
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
