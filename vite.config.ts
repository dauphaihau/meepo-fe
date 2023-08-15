import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    define: {
      "process.env": env,
    },
    plugins: [vue(),],
    build: {
      sourcemap: true, // enable production source maps
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  });
}
