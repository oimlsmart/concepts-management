import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { routes } from "./routes";

// vite-ssg auto-generates one HTML file per route. The includedRoutes
// function in vite.config.ts is called at build time to add per-item
// dynamic routes (terms/<slug>/, publications/<slug>/, tc/<slug>/).
export const createApp = ViteSSG(App, { routes });
