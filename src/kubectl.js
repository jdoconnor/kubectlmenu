const { spawn } = require('child_process')
const getContextCmd = spawn("kubectl", ["config", "view", "-o", "json"]).on('error', function( err ){ throw err })

class Kubectl {
  static getContexts() {
    return new Promise(resolve => {
      getContextCmd.stdout.on('data', (data) => {
        resolve(JSON.parse(data.toString()))
      });
    })
  }
}
exports.Kubectl = Kubectl;
