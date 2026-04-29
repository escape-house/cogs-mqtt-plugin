import { defineConfig } from 'vite';

export default defineConfig({
  base: "./",
  build: {
    outDir: "./build/dev.stenz.mqtt",
    emptyOutDir: true,
  },
});
