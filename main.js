const electron = require('electron')
const { spawn } = require('child_process')
// Module to control application life.
const app = electron.app

const path = require('path')
const url = require('url')
const ipc = electron.ipcMain
const Menu = electron.Menu
const Tray = electron.Tray
var { Kubectl } = require('./src/Kubectl');

const getContextCmd = spawn("kubectl", ["config", "view", "-o", "json"]).on('error', function( err ){ throw err })

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let appIcon

async function createMenuBar () {
  var kubecfg = await Kubectl.getContexts();
  console.log(kubecfg)
  const iconName = 'menubar-icon.png'
  const iconPath = path.join(__dirname, iconName)
  appIcon = new Tray(iconPath)
  menuTemplate = []
  for(context of kubecfg.contexts){
    menuTemplate.push({
      label: context.name,
      click: function() {
        app.quit()
      }
    })
  }
  // add the quit menuitem
  menuTemplate.push({
    label: 'Quit',
    click: function () {
      app.quit()
    }
  })
  
  contextMenu = Menu.buildFromTemplate(menuTemplate)
  
  appIcon.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMenuBar)

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
