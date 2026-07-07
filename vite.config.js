import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // Essenziale per far funzionare il gioco nelle sottocartelle di GitHub Pages
  build: {
    outDir: "dist", // Cartella di output per la build statica
    assetsDir: "assets",
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
  },
});
