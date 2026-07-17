import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Builds the small embeddable chat widget as a single IIFE so it can be
// dropped onto any customer site via <script src=".../widget.js">, with
// no bundler or module system required on their end.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist-widget",
    emptyOutDir: true,
    lib: {
      entry: "src/widget/main.jsx",
      name: "AIFlowWidget",
      formats: ["iife"],
      fileName: () => "widget.js",
    },
  },
});
