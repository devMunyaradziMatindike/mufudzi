import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "apk-content-type",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.split("?")[0].endsWith(".apk")) {
            res.setHeader("Content-Type", "application/vnd.android.package-archive");
          }
          next();
        });
      },
    },
  ],
  build: {
    chunkSizeWarningLimit: 1500,
  },
});
