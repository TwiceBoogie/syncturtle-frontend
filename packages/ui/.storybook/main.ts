import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx|js|jsx|mjs|mdx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-onboarding", "@storybook/addon-themes"],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: async (cfg) =>
    mergeConfig(cfg, {
      server: {
        watch: {
          usePolling: true,
          interval: 120,
          ignored: ["**/.turbo/**", "**/dist/**", "**/.next/**", "**/.cache/**", "**/node_modules/**"],
        },
        hmr: { protocol: "ws" },
      },
      resolve: { dedupe: ["react", "react-dom"] },
      optimizeDeps: { include: ["react/jsx-runtime"] },
    }),
};
export default config;
