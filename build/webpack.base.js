/** @type {import('webpack').Configuration} */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { srcPath, rootPath } = require("./paths");

module.exports = {
  entry: path.join(srcPath, "index.tsx"),

  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: ["babel-loader"],
        include: srcPath,
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    // 几个页面，就配置几个
    new HtmlWebpackPlugin({
      template: path.resolve(rootPath, "template/index.html"),
      filename: "index.html"
      // chunks 表示该页面要引用哪些 chunk ，默认全部引用(如果是多页面要考虑引用的 chunk)
      // chunks: ['index', 'vendor', 'common']  // 要考虑代码分割
    })
  ],

  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".less"]
  }
};
