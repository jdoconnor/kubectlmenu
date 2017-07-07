const { spawn } = require('child_process')

class Kubectl {
  // TODO: dry this up
  static getContexts() {
    return new Promise(resolve => {
      let cmd = spawn("kubectl", ["config", "view", "-o", "json"]).on('error', function( err ){ throw err })
      cmd.stdout.on('data', (data) => {
        resolve(JSON.parse(data.toString()))
      });
    })
  }

  static changeContext(context){
    return new Promise(resolve => {
      let cmd = spawn("kubectl", ["config", "use-context", context]).on('error', function( err ){ throw err })
      cmd.stdout.on('data', (data) => {
        resolve(data)
      });
    })
  }

  static getNamespaces() {
    return new Promise(resolve => {
      let cmd = spawn("kubectl", ["get", "namespaces", "-o", "json"]).on('error', function( err ){ throw err })
      cmd.stdout.on('data', (data) => {
        resolve(JSON.parse(data.toString()))
      });
    })
  }

  static getDeployments() {
    return new Promise(resolve => {
      let cmd = spawn("kubectl", ["get", "deployments", "-o", "json"]).on('error', function( err ){ throw err })
      cmd.stdout.on('data', (data) => {
        resolve(JSON.parse(data.toString()))
      });
    })
  }

  static getPods(namespace) {
    return new Promise(resolve => {
      let cmd = spawn("kubectl", [`--namespace=${namespace}`, "get", "pods", "-o", "json"]).on('error', function( err ){ throw err })
      let fullData = ""
      cmd.stdout.on('data', (data) => {
        fullData = fullData.concat(data)
      })
      cmd.stdout.on('close', (code) => {
        resolve(JSON.parse(fullData.toString()))
      })
    })
  }

}
exports.Kubectl = Kubectl;
