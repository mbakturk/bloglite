module.exports = {
    publicPath: './',
    configureWebpack: {
        devtool:  process.env.NODE_ENV === 'production' ? '' :  'source-map'
    },
    devServer: {
        proxy: 'http://localhost:3000/securePath'
    }
}