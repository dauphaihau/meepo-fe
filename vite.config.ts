import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import VueMacros from 'unplugin-vue-macros/vite';
import ReactivityTransform from '@vue-macros/reactivity-transform/vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    define: {
      'process.env': env,
    },
    plugins: [
      VueMacros({
        plugins: {
          vue: vue(),
        },
      }),
      AutoImport({
        // targets to transform
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],

        // global imports to register
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            '@vueuse/core': [
              // named imports
              'useMouse', // import { useMouse } from '@vueuse/core',
              // alias
              ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
            ],
          },
          // example type import
          {
            from: 'vue-router',
            imports: ['RouteLocationRaw'],
            type: true,
          },
        ],
        // Enable auto import by filename for default module exports under directories
        defaultExportByFilename: false,
        dts: 'src/auto-imports.d.ts',
        // Generate corresponding .eslintrc-auto-import.json file.
        // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
        eslintrc: {
          enabled: true, // Default `false`
          // provide path ending with `.mjs` or `.cjs` to generate the file with the respective format
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
      }),
      vueJsx(),
      ReactivityTransform(),
    ],
    build: {
      sourcemap: true, // enable production source maps
      rollupOptions: { // to fix issue: Some chunks are larger than 500 KiB after minification
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    },
    resolve: {
      alias: [
        { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        { find: '@assets', replacement: fileURLToPath(new URL('./src/assets', import.meta.url)) },
        { find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
        { find: '@services', replacement: fileURLToPath(new URL('./src/services', import.meta.url)) },
        { find: '@config', replacement: fileURLToPath(new URL('./src/config', import.meta.url)) },
        { find: '@core', replacement: fileURLToPath(new URL('./src/core', import.meta.url)) },
        { find: '@lib', replacement: fileURLToPath(new URL('./src/lib', import.meta.url)) },
        { find: '@pages', replacement: fileURLToPath(new URL('./src/pages', import.meta.url)) },
        { find: '@stores', replacement: fileURLToPath(new URL('./src/stores', import.meta.url)) },
        { find: '@composables', replacement: fileURLToPath(new URL('./src/composables', import.meta.url)) },
        { find: '@schemas', replacement: fileURLToPath(new URL('./src/schemas', import.meta.url)) },
      ],
    },
  });
};
