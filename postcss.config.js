module.exports = {
  plugins: [
    [
      // "postcss-preset-env",
      // postcss-preset-env 包含 autoprefixer（添加厂商前缀），
      // 因此如果你已经使用了 preset 就无需单独添加它了
      "autoprefixer",
      {
        // 其他选项
      },
    ],
  ],
};
// 也可以导出一个函数 
// module.exports = (api) => {
  // `api.file` - 文件路径
  // `api.mode` - webpack 的 `mode` 属性值，
  // `api.webpackLoaderContext` - 在复杂情况下使用的 loader 上下文
  // `api.env` - `api.mode` 的别名，与 `postcss-cli` 兼容
  // `api.options` - `postcssOptions` 的选项
  // 返回一个配置对象
  // return {}
// }