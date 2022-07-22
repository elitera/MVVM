# MVVM
## Introduction

![](https://seec-homework.oss-cn-shanghai.aliyuncs.com/mvvm.jpeg)

## Usage

both support `UMD` (Universal Module Definition),`ESM` (ES6 module),`CJS` (common JS)

### UMD

```html
<html>
  <script src="dist/mvvm.umd.js"></script>
  <body>
    <div id="app">
      <div>{{title}}</div>
    </div>
  </body>
  <script>
    new MVVM({
      view: document.getElementById("app"),
      model: {
        title: "hello mvvm!",
      },
      mounted() {
        console.log("主程编译完成,欢迎使用MVVM！");
      },
    });
  </script>
</html>
```

### ESM

```html
<body>
  <div id="app">{{title}}</div>
</body>
<script type="module">
  import MVVM from "../../dist/mvvm.esm.js";
  const data = {
    view: document.getElementById("app"),
    model: {
      title: "标题",
    },
  };
  new MVVM(data);
</script>
```

### CJS

```js
const MVVM = require("../../dist/mvvm.cjs");

const data = {
  view: document.getElementById("app"),
  model: {
    title: "标题",
  },
};
new MVVM(data);
```

## Related Tech

- typescript
- rollup
- jest & codecov
- babel
- prettier
- eslint & stylelint
- action

## Npm Scripts

- `build`: create an all package
- `test`: unit testing by jest

## Documentation

### Instantiate MVVM

```javascript
/*
 * <必选>  view      接受一个 DOM 元素作为编译的目标元素
 * <必选>  model     接受一个对象作为数据模型
 * <可选>  methods   接受一个对象作为 v-on 事件函数的声明
 * <可选>  mounted   接受一个函数作为MVVM编译完成后的回调
 */
new MVVM({
  view: el,
  model: {
    title: "hello mvvm!",
  },
  methods: {
    getIndex: () => {},
  },
  mounted() {
    console.log("主程编译完成,欢迎使用MVVM！");
  },
});
```

## Test

- `test`: unit testing by jest

![](https://seec-homework.oss-cn-shanghai.aliyuncs.com/image-20220714153956347.png)

- `jest`: unit testing

![](https://seec-homework.oss-cn-shanghai.aliyuncs.com/image-20220714154202048.png)

## Demo

运行demo/umd/index.html

![](https://seec-homework.oss-cn-shanghai.aliyuncs.com/image-20220714154311079.png)
