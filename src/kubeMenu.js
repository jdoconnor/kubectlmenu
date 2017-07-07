const { spawn } = require('child_process')
var { Kubectl } = require('./kubectl')
var { Terminal } = require('./terminal')
const electron = require('electron')
const Menu = electron.Menu
const MenuItem = electron.MenuItem

class KubeMenu {
  constructor(app) {
    this.app = app
  }

  async getMenuRoot () {
    var rootMenu = new Menu()
    var contextMenu = new Menu()
    var jp = require('jsonpath');


    // contexts Menu
    var kubeContexts = await Kubectl.getContexts()
    var currentContext = kubeContexts['current-context']
    for(var context of kubeContexts.contexts){
      let checked = (currentContext === context.name) ? true : false
      let contextName = context.name
      contextMenu.append(new MenuItem({
        type: 'radio',
        checked: checked,
        label: contextName,
        click: () => {
          Kubectl.changeContext(contextName)
          this.app.emit('redraw-menu')
        }
      }))
    }

    // namespaces menu
    var namespaces = await Kubectl.getNamespaces()
    rootMenu.append(new MenuItem({
      label: 'contexts',
      submenu: contextMenu
    }))
    rootMenu.append(new MenuItem({
      type: 'separator'
    }))

    for(var namespace of namespaces.items){
      let containerMenu = new Menu()
      rootMenu.append(new MenuItem({
        label: namespace.metadata.name,
        submenu: containerMenu
      }))

      let pods = await Kubectl.getPods(namespace.metadata.name)
      let containerNames = jp.query(pods, "$.items[*].spec.containers[*].name")
      containerNames = [...new Set(containerNames)]

      let containerMenus = []
      for(var containerName of containerNames){
        containerMenus[containerName] = new MenuItem({
          label: containerName
        })
        containerMenu.append(containerMenus[containerName])
      }

      for(var pod of pods.items){
        for(var container of pod.spec.containers) {
          // put the pod listing under the container menu
          let actionMenu = new Menu()
          let containerName = container.name
          console.log(containerName)
          console.log(containerMenus[containerName])
          containerMenus[containerName].append(new MenuItem({
            label: pod.metadata.name,
            submenu: actionMenu
          }))

          let podName = pod.metadata.name
          let podNamespace = pod.metadata.namespace

          actionMenu.append(new MenuItem({
            label: 'bash',
            click: function() {
              Terminal.runExec(podName, containerName, podNamespace)
            }
          }))

          actionMenu.append(new MenuItem({
            label: 'tail',
            click: function() {
              Terminal.runTail(podName, containerName, podNamespace)
            }
          }))
        }
      }
    }

    rootMenu.append(new MenuItem({
      type: 'separator'
    }))
    return rootMenu
  }

}

exports.KubeMenu = KubeMenu;
