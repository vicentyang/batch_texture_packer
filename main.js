'use strict'
const electron      = require('electron');
const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain       = electron.ipcMain;

// work mode
const debug  = 2;

// default production config
let mainFile = '/index.html';
let mainPath = 'file://' +__dirname + mainFile;

// 延迟启动开发工具，貌似直接开会黑屏（原因 不明，- -！）
let openDevTools = (win) => setTimeout(() => win.openDevTools(), 1000);


console.log('currentPath:', mainPath);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {

  let openMain = () => {

      // Create the browser window
      // https://github.com/atom/electron/blob/master/docs/api/browser-window.md
      let mainWindow = new BrowserWindow({
          // toolbar: true,
          fullscreen: false,
          // transparent: true,
          // 'standard-window': true,
          width: 900,
          height: 538,
          // x: external.bounds.x,
          // y: external.bounds.y + 359,
          webSecurity: false
      });

      // and load the index.html of the app.
      mainWindow.loadURL(mainPath);
      mainWindow.on('closed', () => setTimeout(openMain, 2000) );

      openDevTools(mainWindow);

  };

  openMain();

});



// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (debug == 0) {
    app.quit();
  }
});
