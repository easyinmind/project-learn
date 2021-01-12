
const path = require("path");
const webpack = require("webpack");
const { distPath } = require("./paths");
const base = require("./webpack.base.js");
const { merge } = require("webpack-merge");
const TerserJSPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");


module.exports = merge(base, {
  mode: "production",
  output: {
    // entry里列出的文件名，name 即入口时 entry 的 key
    filename: "[name].[contenthash:5].js",
    // 输出的文件目录
    path: distPath,

    // 未在 entry 中列出，但需要被打包出来的 chunk
    // chunkFilename: 'chunk.js',
    // 个人理解，文件引用的前缀（如： 设置为CDN地址等）
    // publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // 小于8k的图片自动转成base64格式，并且不会存在实体图片
              limit: 1024 * 8,
              // 图片打包后存放的目录
              outputPath: "/images/",
              // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
              // publicPath: 'http://cdn.abc.com'
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use:  "url-loader",
      },
      {
        test: /\.less$/,
        use: [
          // 提取css
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              // 允许你配置在 css-loader 之前有多少 loader 应用于@import ed 资源
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, less-loader,

              // 开启css 模块化
              // modules: true
            },
          },
          // 推荐 位置
          // 在 css-loader 和 style-loader 之前使用 postcss-loader，
          // 但是在其他预处理器（例如：sass|less|stylus-loader）之后使用
          {
            loader: "postcss-loader",
          },
          "less-loader",
        ],
      },

      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
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

  optimization: {
    // 压缩 js 和 css
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],

    // 分割代码块
    splitChunks: {
      // 默认 async，
      // initial 入口 chunk，对于异步导入的文件不处理
      // async 异步 chunk，只对异步导入的文件处理
      // all 全部 chunk
      chunks: "all",
      // minSize: 0, // 大小限制
      // minChunks: 1, // 最少复用过几次

      // 缓存分组
      cacheGroups: {
        // 第三方模块
        vendor: {
          name: "vendor", // chunk 名称
          priority: 1, // 权限更高，优先抽离，重要！！！
          test: /node_modules/,
          minSize: 0, // 大小限制
          minChunks: 1, // 最少复用过几次
        },

        // 公共的模块
        common: {
          name: "common", // chunk 名称
          priority: 0, // 优先级
          minSize: 0, // 公共模块的大小限制
          minChunks: 2, // 公共模块最少复用过几次
        },
      },
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      // 设置抽离的css路径及名称， 与output.filename保持一样的规范
      filename: "css/[name].[contenthash:5].css",
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      // 允许在 编译时 创建配置的全局常量，
      // 可以根据常量的值，做一些判断处理，如 开发环境输出日志等
      ENV: JSON.stringify("production"),
    }),
  ],
});
