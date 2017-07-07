const electron = require('electron')
const { spawn } = require('child_process')
const fs = require('fs');

// Module to control application life.
const app = electron.app

const path = require('path')
const url = require('url')
const ipc = electron.ipcMain
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const Tray = electron.Tray
const BrowserWindow = electron.BrowserWindow
import {enableLiveReload} from 'electron-compile';
enableLiveReload();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let appIcon
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

async function createMenuBar(){
  var { KubeMenu } = require('./src/kubeMenu');
  let rootMenu = await new KubeMenu().getMenuRoot()

  // add the quit menuitem
  var quit = new MenuItem({
    label: 'Quit',
    click: function () {
      app.quit()
    }
  })
  rootMenu.append(quit)
  let iconName = 'menubar-icon.png'
  let iconPath = path.join(__dirname, iconName)
  appIcon = new Tray(iconPath)

  appIcon.setContextMenu(rootMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
app.on('ready', createMenuBar)

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
