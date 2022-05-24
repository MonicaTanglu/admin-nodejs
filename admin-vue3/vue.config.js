const path = require('path')
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const cesiumSource = "./node_modules/cesium/Source";
const cesiumBuild = './node_modules/cesium/Build/Cesium'

function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: '/',
    productionSourceMap: false,
    configureWebpack: config => {
        //生产环境取消 console.log
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }

        config.plugins = [
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Workers'), to: 'cesium/Workers' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumBuild, 'Assets'), to: 'cesium/Assets' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumBuild, 'Widgets'), to: 'cesium/Widgets' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty'), to: 'cesium/ThirdParty' }]),
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: './cesium/'
            }),
            ...config.plugins
        ]
        // config.module.rules = [
        //     {
        //         test: /\.js$/,
        //         use: {
        //             loader: 'babel-loader',
        //         },
        //     },
        //     ...config.module.rules
        // ]
        // console.log(config,'config')

    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
        config.resolve.alias.set('_CES', resolve(cesiumBuild))
        // config.resolve.extensions.add('ts').add('tsx')
    },
    css: {
        sourceMap: true,
        extract: false,
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true
                }

            }
        }
    },
    devServer: {
        port: 8081,
        proxy: {
            '/api': {
                target: 'http://localhost:9001/',
                // changeOrigin: true,
                // pathRewrite: {
                //     '^/api': ''
                // }
            }
        }
    }
}