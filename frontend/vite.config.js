import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {  
        // if under this domain, proxy it, don't give any cors errors
        target: "http://localhost:5000", 
      },
    },
  },
});
