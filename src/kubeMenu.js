const electron = require('electron')
const { spawn } = require('child_process')
const fs = require('fs');
var { Kubectl } = require('./kubectl');
var { Terminal } = require('./terminal');
const app = electron.app

const path = require('path')
const url = require('url')
const ipc = electron.ipcMain
const Menu = electron.Menu
const Tray = electron.Tray

class KubeMenu {
  async createMenuBar () {
    var kubecfg = await Kubectl.getContexts();
    var pods = await Kubectl.getPods();
    
    console.log(kubecfg)
    const iconName = 'menubar-icon.png'
    const iconPath = path.join(__dirname, iconName)
    appIcon = new Tray(iconPath)
    menuTemplate = []
    
    contextMenus = []
    for(context of kubecfg.contexts){
      contextMenus.push({
        label: context.name,
        click: function() {
          app.quit()
        }
      })
    }
    menuTemplate.push({
      label: 'contexts',
      submenu: contextMenus
    })
    podnames = pods.items.map(function(item){
      item.spec.containers.map(function(container){
        container.name
      })
    })
    
    podMenus = []
    for(pod of pods.items){
      let runMenu = []
      runMenu.push({
        label: 'bash',
        click: function() {
          Terminal.runExec(pod.metadata.name, pod.metadata.namespace)
        }
      })
      runMenu.push({
        label: 'tail',
        click: function() {
          Terminal.runTail(pod.metadata.name, pod.metadata.namespace)
        }
      })
    
      podMenus.push({
        label: pod.metadata.name,
        submenu: runMenu
      })
    
    }
    
    menuTemplate.push({
      label: 'apps',
      submenu: podMenus
    })
    
    
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

}

exports.KubeMenu = KubeMenu;
