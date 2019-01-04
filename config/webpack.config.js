const path = require('path');
const webpack = require('webpack');

// '..'' Since this config file is in the config folder we need to resolve path to the top level folder
const resolve = dir => path.resolve(__dirname, '..', dir);

const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: 'development',
    entry: { 
        /**
        * Not needed unless we want to create a vue chunk (vue.js) that we need to access from the entry page (assets/index.html)
        */
        // vue: 'vue',
        /**
        * This is where the `main-content` component is - src/index.js. This file contains the entrance point to our app
        * and points to the initial .vue file. This and any subsequent files will be parsed through vue-loader and output 
        * as a chunk 'main' which will be available to index.html as main.js
        */
        main: resolve('src/index.js')
    },
    output: {
        filename: '[name].js',// multiple files of [chunk name] + '.js' e.g. vue.js & main.js
        path: resolve('dist'),// Folder where the webpack output will be served from
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                // This is required for other javascript you are gonna write besides vue.
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    resolve('src'),
                ],
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                )
            },

            {
                // loader for Asset URLs - see: https://github.com/webpack-contrib/url-loader
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',//url-loader
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
        ],
    },
    devtool: 'source-map',
    // ref: https://webpack.js.org/configuration/dev-server/
    devServer: {
        host: '0.0.0.0',// The url you want the webpack-dev-server to use for serving files.
        port: 8020,// Port: Browser location will be localhost:8020
        inline: true,
        watchContentBase: true,
        watchOptions: {
            ignored: /node_modules/,
            poll: true,
        },
        contentBase: './dist',// For static assets - including index.html, which is the start page containing the <div> with the id "app"
        publicPath: '/build/',// The path you want webpack-dev-server to use for serving files
        https: false,
        compress: true,
        // Seems this is necessary if your 'index' file is called anything other than index.html
        /*historyApiFallback: {
          index: 'start.html'
        },*/
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        // Exchanges, adds, or removes modules while an application is running, without a full reload.
        new webpack.HotModuleReplacementPlugin(),
        // Parses .vue files
        new VueLoaderPlugin(),
    ],
    resolve: {
        /**
         * The compiler-included build of vue which allows to use vue templates
         * without pre-compiling them
         */
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
        extensions: ['*', '.vue', '.js', '.json'],
    },
};