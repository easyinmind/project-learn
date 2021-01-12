# 项目搭建

## 一、配置git message规范工具

### 安装 git commit消息工具 `commitizen` 
```
npm i commitizen -D  
```
`commitizen` 是格式化commit message的工具，提供的 git cz 命令替代 git commit 命令，需要结合适配器使用。

### 使用 angular 规范的 预设`cz-conventional-changelog` 。
(还有其它适配器，注意：不同的适配器 具有不同的界面、规范、配置方式) 

```
commitizen init cz-conventional-changelog --save-dev --save-exact
```
这里命令做了三件事(或者不使用 commitizen init，手动安装并配置也可以。)
1. 在项目中安装cz-conventional-changelog 适配器依赖
2. 将适配器依赖保存到package.json的devDependencies字段信息
3. 在package.json中新增config.commitizen字段信息，主要用于配置cz工具的适配器路径
```json
  "devDependencies": {
    "cz-conventional-changelog": "^3.3.0"
  },
  "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
  }
```

需要注意的一点是在初始化适配器之前运行 `npx git cz`，与初始化之后运行效果相同，命令行上展示了使用的适配器  
```
npx git cz
cz-cli@4.2.2, cz-conventional-changelog@3.3.0
```
猜测是 commitizen("^4.2.2") 默认设置了适配器，查阅源码，在 `node_modules/commitizen/dist/cli/git-cz.js`里发现默认配置  
```js
function bootstrap(environment = {}, argv = process.argv) {
  // Get cli args
  let rawGitArgs = argv.slice(2, argv.length);
  let adapterConfig = environment.config || _commitizen.configLoader.load() || {
    path: 'cz-conventional-changelog'
  };
  (0, _strategies.gitCz)(rawGitArgs, environment, adapterConfig);
}
```
### 配置 commit message 校验工具
这样配置完成后方便了书写commit message， 但是书写的是否符合标准，就需要一个lint工具进行校验了

`commitlint` 可以lint commit message。如果提交的不符合指向的规范，会拒绝提交。这个工具也需要一份校验配置，可以使用也符合 Angular团队规范 `@commitlint/config-conventional`

安装并配置文件

```
npm install --save-dev @commitlint/config-conventional @commitlint/cli

echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

这个校验需要在commit message提交前，利用 git hooks触发。
git 在 commit的时候后会按顺序触发 pre-commit、prepare-commit-msg、commit-msg、post-commit。可以在 commit-msg的时候进行校验
安装 `husky`，配置文件

```
npm install husky --save-dev
```

```js
// husky.config.js 
const hooks = {
  'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
};
module.exports = {
  hooks
};
```
npm 安装 husky 的时候，husky 会在项目的.git/hooks文件夹下创建所有支持的hooks（node husky install）
husky 简单来说 让git hooks变得简单，提交的时候会从 package.json、.huskyrc、.huskyrc.json 中获取相应的 hook 配置。或者手动在 `.git/hook/` 目录里改写hook模板文件

### 配置 git commit 替换 git cz
使用git commit 触发 `prepare-commit-msg` 这个钩子的时候调用 git cz，这样在使用的时候直接 git commit就可以了，符合日常提交方式
```js
const { platform } = require('os');
const isWindow = platform() === 'win32';
const hooks = {
  'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
};
// window 环境不支持
if (!isWindow) {
  hooks['prepare-commit-msg'] = 'exec < /dev/tty && git cz --hook || true';
}

module.exports = {
  hooks
};
```

## 二、配置 eslint 及 pretter

如果使用eslint-loader在webpack构建的时候校验，代码量较大的时候耗时太长了。这里配置的 eslint 放在代码提交的时候进行 lint，保证提交的代码质量。至于在开发阶段可以在 vscode 中配置插件来获取提示信息。

eslint、stylelint、pretter校验文件的区别  
+ eslint：js、ts、jsx、tsx
+ stylelint：css、less、scss……
+ pretter：包含eslint、stylelint及html、md

在格式化代码方面， Prettier 确实和 ESLint 有重叠，但两者侧重点不同：ESLint 主要工作就是检查代码质量并给出提示，它所能提供的格式化功能很有限；而 Prettier 在格式化代码方面具有更大优势。所幸，Prettier 被设计为易于与 ESLint 集成，所以你可以轻松在项目中使两者，而无需担心冲突

安装Eslint pretter

```
npm i eslint prettier -D
```

初始化 eslint `npx eslint init`  
选择 problems、esm、ts、react、browser  
```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {},
};

```

配置 prettier 的配置文件

```js
// prettierrc.js
module.exports = {
  printWidth: 80, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, //一个tab代表几个空格数，默认为80
  useTabs: false, //是否使用tab进行缩进，默认为false，表示用空格进行缩减
  singleQuote: false, //字符串是否使用单引号，默认为false，使用双引号
  semi: true, //行位是否使用分号，默认为true
  trailingComma: "none", //是否使用尾逗号，有三个可选值"<none|es5|all>"
  bracketSpacing: true, //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  parser: "babylon", //代码的解析引擎，默认为babylon，与babel相同。
};
```

如何结合eslint prettier  
ESLint 和 Prettier 相互合作的时候有一些问题，对于他们交集的部分规则，ESLint 和 Prettier 格式化后的代码格式不一致。导致的问题是：当你用 Prettier 格式化代码后再用 ESLint 去检测，会出现一些因为格式化导致的 warning，当你用eslint --fix修复问题，又无法通过Prettier校验，导致陷入一开始提到的“死循环问题”。
这种问题的主要解决思路是在 ESLint 的规则配置文件上做文章，安装特定的 plugin，把其配置到规则的尾部，实现 Prettier 规则对 ESLint 规则的覆盖。 
```
npm install --save-dev eslint-config-prettier
```
```js
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
}
```  
extends的值为数组，会继承和覆盖前面的配置，将Prettier配置添加到其它拓展的后面，可以实现 Prettier 规则对 ESLint 规则的覆盖。
完成上述两步可以实现的是运行 ESLint 命令会按照 Prettier 的规则做相关校验，但是还是需要运行 Prettier 命令来进行格式化。为了避免多此一举，万能的社区早就提出了整合上面两步的方案：在使用 eslint --fix 时候，实际使用 Prettier 来替代 ESLint 的格式化功能。如下：
```js
// 安装eslint-plugin-prettier
npm install --save-dev eslint-plugin-prettier

// 在 .eslintrc.js 文件里面的 extends 字段添加：
{
  "extends": [
    ...,
    "已经配置的规则",
+   "plugin:prettier/recommended"
  ],
  "rules": {
    "prettier/prettier": "error",
  }
}
```  
这个时候你运行 eslint --fix 实际使用的是 Prettier 去格式化文件。在rules中添加"prettier/prettier": "error"，当代码出现Prettier校验出的格式化问题，ESLint会报错

在git commit之前pre-commit这个钩子执行的时候去校验比较合适，这里有个问题就是每次都会去校验所有的文件，可以通过 `lint-staged` 解决  
`lint-staged` 识别被加入到stage区文件，每次只对当前修改后的文件进行扫描，即进行git add加入到stage区的文件进行扫描即可，完成对增量代码进行检查  
```
npm install -D lint-staged
```
增加配置  
```js
// husky.config.js
'pre-commit': 'lint-staged',
```
```json
// package.json
"lint-staged": {
  "src/**/*.{js,vue}": ["prettier --write", "eslint --cache --fix", "git add"]
}
```
在进行git commit的时候会触发到git hook进而执行precommit，而precommit脚本引用了lint-staged配置表明只对git add到 stage 区的文件进行扫描，具体lint-staged做了三件事情：

+ 执行Prettier脚本，这是对代码进行格式化的;
+ 执行eslint --fix操作，进行扫描，对eslint问题进行修复；
+ 上述两项任务完成后将代码重新add进 stage 区，然后执行commit。("git add"可加可不加，具体看情况而定)

