const { spawn } = require('child_process')
var terminalTab = require('terminal-tab')

class Terminal {
  static runCommand(command){
    terminalTab.open(`${command}`)
  }

  static runExec(podName, containerName, namespace){
    let command = `kubectl --namespace ${namespace} exec -it ${podName} -c ${containerName} /bin/bash`
    this.runCommand(command)
  }

  static runTail(podName, containerName, namespace){
    let command = `kubectl --namespace ${namespace} logs -f ${podName} -c ${containerName}`
    this.runCommand(command)
  }
}
exports.Terminal = Terminal;
