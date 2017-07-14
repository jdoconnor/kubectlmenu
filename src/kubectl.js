const { spawn, spawnSync } = require('child_process')

var log = require('electron-log')
class Kubectl {
  // TODO: dry this up
  static getContexts() {
    return new Promise(resolve => {
      let cmd = spawnSync("/usr/local/bin/kubectl", ["config", "view", "-o", "json"])
      resolve(JSON.parse(cmd.stdout))
    })
  }

  static changeContext(context){
    return new Promise(resolve => {
      let cmd = spawnSync("/usr/local/bin/kubectl", ["config", "use-context", context])
      resolve(JSON.parse(cmd.stdout))
    })
  }

  static getNamespaces() {
    return new Promise(resolve => {
      let cmd = spawnSync("/usr/local/bin/kubectl", ["get", "namespaces", "-o", "json"])
      resolve(JSON.parse(cmd.stdout))
    })
  }

  static getDeployments() {
    return new Promise(resolve => {
      let cmd = spawnSync("/usr/local/bin/kubectl", ["get", "deployments", "-o", "json"])
      resolve(JSON.parse(cmd.stdout))
    })
  }

  static getPods(namespace) {
    return new Promise(resolve => {
      let cmd = spawnSync("/usr/local/bin/kubectl", [`--namespace=${namespace}`, "get", "pods", "-o", "json"])
      resolve(JSON.parse(cmd.stdout))
    })
  }

}
exports.Kubectl = Kubectl;
