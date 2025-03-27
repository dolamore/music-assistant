import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',  // Automatic JSX runtime
            include: [/\.jsx?$/, /\.js?$/],  // Support .js and .jsx files
        }),
        babel({
            babelConfig: {
                presets: ['@babel/preset-react'],
                compact: false,
            },
            include: [/\.jsx?$/, /\.js?$/],  // Support .js and .jsx files
        }),
        commonjs(),
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: 'src/index.jsx',
        },
        commonjsOptions: {
            transformMixedEsModules: true,  // Handle mixed ES and CommonJS modules
        },
    },
    server: {
        host: '0.0.0.0',
        port: 3001,
    },
    esbuild: {
        loader: {
            '.js': 'jsx',
            '.jsx': 'jsx',// Treat .js files as JSX
        },
        include: /src\/.*\.js$/,  // Only include .js files in the src directory
    },
});