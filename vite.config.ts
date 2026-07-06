import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".", // project root, usually your repo root
  plugins: [react()],
  
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 8080,
    open: false, // set to true to open the browser automatically
    strictPort: true, // fail if the port is already in use
    allowedHosts: true

  },
});
