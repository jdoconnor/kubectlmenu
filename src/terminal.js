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
