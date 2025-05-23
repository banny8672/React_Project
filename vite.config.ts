import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export function componentTagger() {
  return {
    name: 'vite-plugin-component-tagger',
    transform(code: string, id: string) {
      if (id.endsWith('.tsx') || id.endsWith('.jsx')) {
        return code.replace(
          /<([A-Z][a-zA-Z0-9]*)/g,
          `<$1 data-component="$1"`
        );
      }
      return code;
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
