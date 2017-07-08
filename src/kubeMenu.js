const { spawn } = require('child_process')
var { Kubectl } = require('./kubectl')
var { Terminal } = require('./terminal')
const electron = require('electron')
const Menu = electron.Menu
const MenuItem = electron.MenuItem

class KubeMenu {
  constructor(app) {
    this.app = app
    this.jp = require('jsonpath');
  }

  async getMenuRoot () {
    var rootMenu = new Menu()
    var contextMenu = new Menu()

    var rootMenu = [
      { label: 'contexts', submenu: await this.createContextTemplate() },
      { type:  'separator' },
      { label: 'namespaces', submenu: await this.createNamespacesTemplate()}
    ]
    return Menu.buildFromTemplate(rootMenu)
  }

  async createContextTemplate(){
    var template = []
    var kubeContexts = await Kubectl.getContexts()
    var currentContext = kubeContexts['current-context']
    for(var context of kubeContexts.contexts){
      let checked = (currentContext === context.name) ? true : false
      let contextName = context.name
      template.push({
        type: 'radio',
        checked: checked,
        label: contextName,
        click: () => {
          Kubectl.changeContext(contextName)
          this.app.emit('redraw-menu')
        }
      })
    }
    return template
  }

  async createNamespacesTemplate(){
    var template = []
    var namespaces = await Kubectl.getNamespaces()
    for(var ns of this.jp.query(namespaces, "$.items[*].metadata.name")){
      template.push({ label: ns, submenu: await this.createContainersTemplate(ns) })
    }
    return template
  }

  async createContainersTemplate(ns){
    var template = []
    var pods = await Kubectl.getPods(ns)
    for(var pod of pods.items){
      var containerNames = [...new Set(this.jp.query(pod, "$.spec.containers[*].name"))]
      for(var container of containerNames){
        template.push({ label: container, submenu: this.createActionTemplate(ns, pod.metadata.name, container) })
      }
    }
    return template
  }

  createActionTemplate(ns, pod, container){
    var template = []
    template.push({
      label: 'exec',
      click: () => {
        Terminal.runExec(pod, container, ns)
      }
    })
    template.push({
      label: 'tail',
      click: () => {
        Terminal.runTail(pod, container, ns)
      }
    })
    return template
  }
}

exports.KubeMenu = KubeMenu;
