import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { isLoginPage } from "./src/helpers";

// https://vite.dev/config/
export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
			},
		},
	},
  plugins: [react()],
  server: {
    open: isLoginPage ? true : "/lo/reset",
    port: 3001,
  },
});
