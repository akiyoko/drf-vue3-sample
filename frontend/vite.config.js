import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // ここから追記
  build: {
    // アセットを出力するディレクトリを「assets」から「static/spa」に変更
    // index.html のアセットのパスも変更される
    assetsDir: "static/spa/",
  },
});
