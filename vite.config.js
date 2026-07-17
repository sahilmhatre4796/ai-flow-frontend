import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Builds the authenticated dashboard app (login -> workspace -> bot builder,
// knowledge base, conversations, leads, analytics, marketplace, billing).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
