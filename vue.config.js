module.exports = {
    devServer: {
        port: 3000
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "./src/assets/css/index.scss";`
            }
        }
    }
}