import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        // Copy public files to dist
        copyPublicDir: true,
    },
    // Đảm bảo các file trong folder data được copy
    publicDir: 'public',
})
