const { spawn } = require('child_process')
var { Kubectl } = require('./kubectl');
var { Terminal } = require('./terminal');
const electron = require('electron')
const Menu = electron.Menu
const MenuItem = electron.MenuItem

class KubeMenu {
  async getMenuRoot () {
    var kubeContexts = await Kubectl.getContexts();
    var pods = await Kubectl.getPods();
    var rootMenu = new Menu()
    var contextMenu = new Menu()
    var appMenu = new Menu()
    rootMenu.append(new MenuItem({
      label: 'contexts',
      submenu: contextMenu
    }))

    rootMenu.append(new MenuItem({
      label: 'apps',
      submenu: appMenu
    }))

    var currentContext = kubeContexts['current-context']
    for(var context of kubeContexts.contexts){
      let checked = (currentContext === context.name) ? true : false
      contextMenu.append(new MenuItem({
        type: 'radio',
        checked: checked,
        label: context.name,
        click: function() {
          app.quit()
        }
      }))
    }

    var podnames = pods.items.map(function(item){
      item.spec.containers.map(function(container){
        container.name
      })
    })

    var podMenus = []
    for(var pod of pods.items){
      let actionMenu = new Menu()
      appMenu.append(new MenuItem({
        label: pod.metadata.name,
        submenu: actionMenu
      }))

      let podName = pod.metadata.name
      let podNamespace = pod.metadata.namespace

      actionMenu.append(new MenuItem({
        label: 'bash',
        click: function() {
          Terminal.runExec(podName, podNamespace)
        }
      }))

      actionMenu.append(new MenuItem({
        label: 'tail',
        click: function() {
          Terminal.runTail(podName, podNamespace)
        }
      }))

    }

    return rootMenu
  }

}

exports.KubeMenu = KubeMenu;
