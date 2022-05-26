const path = require('path')
const CopyWebpackPlugin = require("copy-webpack-plugin");
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
      new CopyWebpackPlugin([
        {
          from: cesiumBuild,
          to: './Cesium',
          toType: 'dir'
        },
      ]),
      ...config.plugins
    ];

    config.externals = config.externals || {};
    config.externals.cesium = 'Cesium';
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
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
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://localhost:9001/',
      },
      '/geoserver': {
        target: 'http://localhost:8080/',
      }
    }
  }
}