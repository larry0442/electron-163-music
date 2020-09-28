This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## 这个 react 项目是怎么生成的，按需引入怎么做到的
1. 使用 create-react-app 生成 react+ts 项目 
  ```js
  // 没安装的话先安装这个 create-react-app 咯
  npx create-react-app --template typescript
  ```
2. 安装 antd 以及 babel-plugin-import 
```js
  npm install antd --save
  npm install babel-plugin-import --save-dev
```
3. 安装 react-app-rewired, cross-env 和 customize-cra
```js
  npm install -D react-app-rewired, cross-env, customize-cra
```
安装之后 修改 package.json 之中的 scripts, 将 react-scripts 改成 react-app-ewwired，修改的最终成果

```json
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test"
  }
```
4. 千万不能忘了的 react-app-rewired 配置，他的作用是拓展 webpack 配置：
```js
   // 在 package.json 的同级目录新建一个名为 config-overrides.js 的文件, 注意是 commomJs 规范的
   // config.overrides.js
   const { override, fixBabelImports } = require('customize-cra');

   module.exports = override({
     fixBabelImports('import', {
       libraryName: 'antd',
       libraryDirectory: 'es',
       style: 'css', // 引入 less 的时候，这里应该要设置为 true
     })
   })
```
5.  好了，到此为止就可以搭建出了一个按需加载的  react + antd + ts 的项目基础框架

6. 集合 electron 环境
```js
npm i -D electron

// 然后增加 main.js 文件
// main.js, 注意路径在项目根目录，即和 package.json 同层级
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow = null;

const createWindow = ()=>{
  let mainWindow  = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      nodeIntegration: true,
    }
  });

  /* loadUrl
    1. 开发环境： localhost:3000, 指向 react 的开发环境地址
    2. 生产环境： 指向打包之后的 react build 的index.html
  */
  const startUrl = (
    process.env.NODE_ENV === 'devehttp://lopment'
      ? 'http://localhost:3000'
      : path(__dirname, '/build/index.html')
  )
  mainWindow.loadURL(startUrl)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
};
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  if(mainWindow === null) {
    createWindow()
  }
})
```
7. 修改 package.json 文件,
```js
  // 1. 增加内容
  "main": "main.js", // 声明主要入口文件
  "author": "web",
  "description": "test",
  // 修改 script 中的启动命令
  "start": "cross-env BROWSER=none react-app-rewired start", // 修改
  "start-electron": "cross-env NODE_ENV=development electron .", // 新增
```

8. 激动人心的时刻：
 a. 开一个窗口 先执行：
 ```js
  npm run start
 ```
 b. 再开一个窗口，执行：
 ```js
    npm run start-electron
 ```
9. 这样就可以看到 react 在一个 electron 应用之中了