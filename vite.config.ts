import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "AMapTianDiTuLayer",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
  },
});
