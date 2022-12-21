import react from "@vitejs/plugin-react";
import { ConfigEnv, defineConfig, UserConfig } from "vite";

// see https://vitejs.dev/config/

export default defineConfig(({ command }: ConfigEnv) => {
  const cfg: UserConfig = {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // see https://rollupjs.org/guide/en/#outputmanualchunks
            vendor: ["react", "react-dom"],
          },
        },
      },
    },
  };

  if (command === "build") {
    // when `vite build`
    cfg.esbuild = {
      drop: ["console", "debugger"],
      // see https://esbuild.github.io/api/#drop
    };
  }

  return cfg;
});
