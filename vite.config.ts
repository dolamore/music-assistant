import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import babel from 'vite-plugin-babel';

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',  // Automatic JSX runtime
            include: [/\.tsx?$/, /\.ts?$/],  // Support for .jsx, .js, .tsx, and .ts files
        }),
        babel(),
        commonjs(),
    ],
    build: {
        sourcemap: true,
        outDir: 'dist',
        rollupOptions: {
            input: 'src/index.tsx',
        },
        commonjsOptions: {
            transformMixedEsModules: true,  // Handle mixed ES and CommonJS modules
        },
    },
    server: {
        host: '0.0.0.0',
        port: 3001,
    },
});