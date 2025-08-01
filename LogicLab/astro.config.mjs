// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  site: "https://enzzoms.github.io",
  base: "LogicLab"
});