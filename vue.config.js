module.exports = {
  devServer: {
    open: true,
    proxy: {
      "/api": {
        target: "http://3.84.110.44:8080",
        changeOrigin: true
      }
    }
  }
}
