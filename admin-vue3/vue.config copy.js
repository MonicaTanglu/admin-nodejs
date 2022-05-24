const path = require('path')
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const cesiumSource = "./node_modules/cesium/Source";
const cesiumBuild = './node_modules/cesium/Build/Cesium'

// function resolve (dir) {
//     return path.join(__dirname, dir);
// }

module.exports = {
    publicPath: '/',
    productionSourceMap: false,
    configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve('src'),
                'cesium': path.resolve(__dirname, cesiumBuild)
            }
        },
        plugins: [
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Workers'), to: 'cesium/Workers' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumBuild, 'Assets'), to: 'cesium/Assets' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumBuild, 'Widgets'), to: 'cesium/Widgets' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty'), to: 'cesium/ThirdParty' }]),
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: JSON.stringify('./cesium/')
            }),
        ],
    },
    // chainWebpack: (config) => {
    //     config.resolve.alias
    //         .set('@', resolve('src'))
    //     config.resolve.extensions.add('ts').add('tsx')
    // },
    css: {
        sourceMap: true,
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
            }
        }
    }
}