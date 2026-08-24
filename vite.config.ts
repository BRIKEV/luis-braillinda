import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { twd } from 'twd-js/vite-plugin'
import { twdRemote } from 'twd-relay/vite'
import istanbul from 'vite-plugin-istanbul'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // TWD mounts its sidebar and discovers tests through a virtual module, so
    // there is no TWD code in src/main.tsx. Both plugins are dev-only.
    twd({
      testFilePattern: '/**/*.twd.test.{ts,tsx}',
      open: true,
      position: 'left',
    }),
    twdRemote() as PluginOption,
    // Coverage instrumentation. `requireEnv` keeps it off during ordinary
    // `npm run dev`; CI turns it on by setting CI=true via the dev:ci script.
    // Production builds are never instrumented (forceBuildInstrument is off).
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', '**/*.twd.test.ts'],
      requireEnv: !process.env.CI,
      extension: ['.ts', '.tsx'],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
