const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const base = require("./webpack.base.js");

module.exports = merge(base, {
  mode: "development",
  // devtool: "inline-source-map",
  devServer: {
    // 告诉 dev server从哪查找，在哪个文件夹起一个服务器（ 根目录 ）
    contentBase: path.resolve(__dirname, "../dist"),
    port: 8080,

    // 打开浏览器
    // open: true,

    // 启动 gzip 压缩
    compress: true,
    // 是否开启热更新
    hot: true,
    // 即使hmr不生效，也不让浏览器自动刷新
    // 默认如果HMR出了问题，会自动刷新页面，但是开启之后可以不让浏览器刷新
    hotOnly: true,
    // 显示打包的进度条
    progress: true,

    // 代理相关
    proxy: {
      // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
      // "/api": "http://localhost:3000",
      // 将本地 /api2/xxx 代理到 localhost:3000/xxx
      // "/api2": {
      //   target: "http://localhost:3000",
      //   pathRewrite: {
      //     "/api2": "",
      //   },
      // },
    },
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              // modules: true
            },
          },
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: "file-loader",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use:  "file-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    // 开启 热更新
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify("development"),
    }),
  ],
});
