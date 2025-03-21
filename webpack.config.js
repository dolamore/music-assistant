import { fileURLToPath } from 'url';
import { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin'; // Импортируем плагин для HTML

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from 'path';

export default {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 3000,
    },
    optimization: {
        minimize: true, // Минимизация для продакшн
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',  // Указываем исходный HTML-файл
            filename: 'index.html',       // Генерируемый файл
        }),
    ],
};
