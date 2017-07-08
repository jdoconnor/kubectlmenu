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
    var containerNames = [...new Set(this.jp.query(pods, "$.items[*].spec.containers[*].name"))]
    for(var container of containerNames){
      template.push({
        label: container,
        submenu: this.createPodTemplate(pods, container)
      })
    }
    return template
  }

  createPodTemplate(pods, container) {
    var template = []
    for(var pod of pods.items){
      // if this pod is running this container, add an exec and tail to the menu
      var containersInPod = this.jp.query(pod, "$.spec.containers[*].name")
      if(containersInPod.includes(container)){
        template.push({
          label: 'exec',
          click: () => {
            Terminal.runExec(pod.metadata.name, container, pod.metadata.namespace)
          }
        })
        template.push({
          label: 'tail',
          click: () => {
            Terminal.runTail(pod.metadata.name, container, pod.metadata.namespace)
          }
        })
        break
      }
    }
    return template
  }
}

exports.KubeMenu = KubeMenu;
