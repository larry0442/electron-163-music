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
    process.env.NODE_ENV === 'development'
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