const { spawn } = require('child_process')
var { Kubectl } = require('./kubectl');
var { Terminal } = require('./terminal');
const electron = require('electron')
const Menu = electron.Menu

class KubeMenu {
  async getMenuRoot () {
    var kubecfg = await Kubectl.getContexts();
    var pods = await Kubectl.getPods();
    
    // console.log(kubecfg)
    var menuTemplate = []
    
    var contextMenus = []
    for(var context of kubecfg.contexts){
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
    var podnames = pods.items.map(function(item){
      item.spec.containers.map(function(container){
        container.name
      })
    })
    
    var podMenus = []
    for(var pod of pods.items){
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
    
    var contextMenu = Menu.buildFromTemplate(menuTemplate)
    return contextMenu
  }

}

exports.KubeMenu = KubeMenu;
