import { fileURLToPath, URL } from "url";

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
  // index.html のアセットのパスの先頭に付けられるパス
  // base: process.env.NODE_ENV === "production" ? "/static/" : "/",

  build: {
    // 出力先を「../static」にすると、index.html, favicon.ico もそこに配置されてしまうので、NG
    // outDir: "../static",
    // 「dist」配下を先に空っぽにする
    // emptyOutDir: true,
    // アセットを出力するディレクトリを「assets」から「static/assets」に変更
    // index.html のアセットのパスも変更される
    assetsDir: "static/assets/",
  },
});
