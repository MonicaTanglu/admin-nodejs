const path = require('path')

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
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
        config.resolve.extensions.add('ts').add('tsx')
    },
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
                // changeOrigin: true,
                // pathRewrite: {
                //     '^/api': ''
                // }
            },
            '/geoserver': {
                target: 'http://localhost:9001/',
            }
        }
    }
}