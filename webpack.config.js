import { fileURLToPath } from 'url';
import { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin'; // Импортируем плагин для HTML
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from 'path';

export default {
    entry: './src/index.jsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './'
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
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV === 'production'
                        ? MiniCssExtractPlugin.loader
                        : 'style-loader',
                    'css-loader'
                ]
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
        hot: true, // Включает Hot Module Replacement (HMR)
        liveReload: true, // Включает live reload (если HMR не работает)
    },
    optimization: {
        minimize: true, // Минимизация для продакшн
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',  // Указываем исходный HTML-файл
            filename: 'index.html',
            inject: 'body',// Генерируемый файл
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
    ],
};
