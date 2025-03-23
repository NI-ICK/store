import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './__tests__/setup.ts'
    },
    resolve: {
        alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
    }
})