module.exports = {
  presets: [
    // 从右往左，从下往上(类似webpack loader)
    // 使用@babel/preset-env + useBuiltIns + corejs
    [
      "@babel/preset-env",
      {
        // 按需引入polyfill, useBuiltIns 告诉了@babel/preset-env 如何根据应用的兼容目标(targets)来处理 polyfill
        useBuiltIns: "usage", // entry根据浏览器版本， usage根据文件使用情况
        // 需要指定corejs版本
        corejs: 3,
        // 支持环境可以通过 targets 参数来指定，其语法可参考 browserslist 来确认。使用方法也很简单，假设应用只需支持到 Chrome 58
        // targets: {chrome: 58}
        targets: {
          esmodules: true
        }
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  plugins: [
    // 使用@babel/plugin-transform-runtime
    // [
    //   '@babel/plugin-transform-runtime',
    //   {
    //     corejs: 3
    //   }
    // ]
  ],
};
