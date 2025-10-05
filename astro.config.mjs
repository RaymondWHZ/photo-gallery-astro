// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
    // Environment Variables
    env: {
        schema: {
            NOTION_TOKEN: envField.string({
                context: "server",
                access: "secret",
            }),
            NOTION_CMS_PAGE_ID: envField.string({
                context: "server",
                access: "secret",
            }),
            PUBLIC_GITHUB_REPO_URL: envField.string({
                context: "server",
                access: "public",
            }),
        },
    },
    // Prefetching
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "viewport",
    },
    // Tailwind CSS
    vite: {
        plugins: [tailwindcss()],
    },
    // Svelte
    integrations: [svelte()],
    // Vercel Deployment
    output: "server",
    adapter: vercel({
        isr: {
            expiration: 10,
            exclude: ["/image/[id]"],
        },
    }),
});
