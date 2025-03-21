import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';
import commonjs from 'vite-plugin-commonjs';
import { createHtmlPlugin } from 'vite-plugin-html';

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
        createHtmlPlugin({
            inject: {
                injectScript: '<script type="module" src="/src/index.jsx"></script>',
                injectStyle: '<link rel="stylesheet" href="/src/styles.css">'
            },
        }),
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: 'src/index.jsx',
            entryFileNames: 'assets/index.jsx',  // Имя файла для JS
        },
        css: {
            filename: 'assets/styles.css',  // Переименовываем CSS файл
        },
        commonjsOptions: {
            transformMixedEsModules: true,  // Handle mixed ES and CommonJS modules
        },
    },
    server: {
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