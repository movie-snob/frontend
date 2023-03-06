module.exports = {
  devServer: {
    disableHostCheck: true,
    allowedHosts: ["*"],
    proxy: {
      "^/api": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
