import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    // Served from https://gastonri.github.io/iss-is-above/
    base: process.env.GITHUB_ACTIONS ? '/iss-is-above/' : '/',
    test: { environment: 'node' }
});
