import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      name: "AMapTiandituLayer",
    },
    // rollupOptions: {
    //   // 请确保外部化那些你的库中不需要的依赖
    //   external: ["vue"],
    //   output: {
    //     // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
    //     globals: {
    //       vue: "Vue",
    //     },
    //   },
    // },
  },
});
