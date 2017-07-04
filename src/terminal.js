const { spawn } = require('child_process')

class Terminal {
  static runCommand(command){
    let child = spawn(
      "osascript",
      ["-e", `tell application "Terminal" to do script "${command}"`],
      {
        detached: true,
        stdio: 'ignore'
      }
    )
  }
  
  static runExec(podName, namespace){
    let command = `kubectl --namespace ${namespace} exec -it ${podName} /bin/bash`
    this.runCommand(command)
  }
  
  static runTail(podName, namespace){
    let command = `kubectl --namespace ${namespace} logs -f ${podName}`
    this.runCommand(command)
  }
}
exports.Terminal = Terminal;
