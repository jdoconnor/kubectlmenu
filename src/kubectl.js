const { spawn, spawnSync } = require('child_process')

class Kubectl {
  // TODO: dry this up
  static getContexts() {
    return new Promise(resolve => {
      let cmd = spawnSync("kubectl", ["config", "view", "-o", "json"])
      resolve(JSON.parse(cmd.stdout))
    })
  }

  static changeContext(context){
    return new Promise(resolve => {
      let cmd = spawnSync("kubectl", ["config", "use-context", context])
      resolve(JSON.parse(cmd.stdout))
    })
  }

  static getNamespaces() {
    return new Promise(resolve => {
      let cmd = spawnSync("kubectl", ["get", "namespaces", "-o", "json"])
      resolve(JSON.parse(cmd.stdout))
    })
  }

  static getDeployments() {
    return new Promise(resolve => {
      let cmd = spawnSync("kubectl", ["get", "deployments", "-o", "json"])
      resolve(JSON.parse(cmd.stdout))
    })
  }

  static getPods(namespace) {
    return new Promise(resolve => {
      let cmd = spawnSync("kubectl", [`--namespace=${namespace}`, "get", "pods", "-o", "json"])
      resolve(JSON.parse(cmd.stdout))
    })
  }

}
exports.Kubectl = Kubectl;
