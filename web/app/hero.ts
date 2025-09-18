// hero.ts
import { heroui } from "@heroui/react";

// ts(2742) if we don't have this
const plugin: unknown = heroui({
  themes: {
    light: {
      colors: {
        background: "#FFFFFF",
        foreground: "#0F172A",
        content1: "#FFFFFF",
        content2: "#F8FAFC",
        default: { DEFAULT: "#F3F4F6", foreground: "#0F172A" },
      },
    },
    dark: {
      colors: {
        background: "#0B1110",
        foreground: "#E5E7EB",
        content1: "#0F1514",
        content2: "#121B19",
        default: { DEFAULT: "#0F1541", foreground: "#E5E7EB" },
      },
    },
  },
});
export default plugin;
