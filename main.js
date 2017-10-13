const electron = require('electron')
const { spawn } = require('child_process')
const fs = require('fs');

// Module to control application life.
const app = electron.app

const path = require('path')
const url = require('url')
const ipc = electron.ipcMain
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const Tray = electron.Tray
const BrowserWindow = electron.BrowserWindow
const nativeImage = require('electron').nativeImage
var log = require('electron-log')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let appTray

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

async function createMenuBar(){
  var { KubeMenu } = require('./src/kubeMenu');
  let rootMenu = await new KubeMenu(app).getMenuRoot()

  // add the quit menuitem
  var quit = new MenuItem({
    label: 'Quit',
    click: function () {
      app.quit()
    }
  })
  rootMenu.append(quit)
  let icon = nativeImage.createFromDataURL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
    AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwY
    AAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpu
    czptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9
    Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRm
    OkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8v
    bnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3Rp
    ZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+Cjwv
    eDp4bXBtZXRhPgpMwidZAAADd0lEQVQ4ETVTbWxTVRh+zjn3tmVdt0LnhpuETcyY2iGB0rCFzMTx
    w8UYYkyMMGYiRDAQJHGYLIZosphojDEyfhg/osZBFESJRJkBYQYQIZ2buK0akG3SsrV0H3bd1nt7
    P47vvctOcu593s/zvO95D0BLSsl6e6XiYGeRXER7b/+wNto/pCUsSx4gObBoBXqlVEhmS86LYDGw
    mJz3xf7U4l3HNYm2tMT2lPzgmC6vDWg3NU0epMCSpUROEjeYgGoY2DMQL7zy26CsPXZ9Dn3pvNWx
    xcM9KkPnRd1eX+ETO6MBNNbj9oawt8ur4iPGmO7SnltAx4+X0Pn8JzOAbVh1VYJhXIpHVqko8tEZ
    SU1oFYZ96IdJie/Emu7dK4881YRyYnLYZTD4t/lr/Rv/Nb611TYtmynxpInXW0vxwEoVII+7KQPv
    n5hFWYChIsTN105LJdYZ/D1Sr0Y50a/8dyK/FsLAyD1bbI348GnHfYgN5vFHPI/4Pxou9+XR1V6G
    55r9SE7aAh4TiZT2EDFYxekTTk+yELyW/GzIAtXlnrq8RKAkwBEMCISCjhvg9ONIn8FQLO3UlCgl
    VT3P5uzI6BRR1WE9vZqz0HKBjfvT2Bj2Yc1qL+4vV9EU9aN6bwr+ZRwvPUptm5P2SEZgctrexDMz
    smH4jo5wkLOmWgWBYoHug6VYEVQwmijg1piOgJ/jbHvQtUVqVNSt4GwooSEzYzfyzJTRcLo/h7ao
    KtbXeuElmtOzFk71ZLGubhk2rSvC9+dmkUwbLoMaupn9TR7x040cUpnCZnZrrBB79cOFSHJhwRoY
    scQXu/2oqVRgU4FTMxYKBug2SCZFXrfR8vYsomuFVcx94ug+/5Aztg9fieWz2JmSjx+asNCWlGcu
    ZEkt5eXrOfnL1ZyLrw3MSey6K7e0k8+OCfnz1fl5MjymUNf/IrDn2xfk189+Pg34mBybMNj5Sznc
    y1puSWfOZzGfl4AlcYXij7eG0Nzge5libyjOIyJwQjdk+Gim/PCBr9Im+Skfn5vHqWEToKY3VAm0
    bvZSDdJ4t6VCfaZZfY9iuk+elILR6YQZpQfG02bPO1+aT3Z9k7HwIBfwkdKxUB7ctOwXt5XxN3ep
    vdWV6hOkcV+xO8qUhFMSm/7ld8aNntsJfYMQTJc2uDPKtG3Cnuoqz2B1ldpCvuNLMf8DL0S19trP
    OJoAAAAASUVORK5CYII=`)
  // let iconName = `${app.getAppPath()}/menubar-icon.png`
  // let iconPath = path.join(__dirname, iconName)
  appTray = new Tray(icon)
  appTray.setContextMenu(rootMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMenuBar)
app.on('redraw-menu', (event) => {
  appTray.destroy()
  createMenuBar()
})

app.on('show-progress-menu', (event) => {
  console.log("in show progress menu")
  // show a loading icon
  let icon = nativeImage.createFromDataURL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjE2PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTctMTAtMTNUMTI6MTA6NjU8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy43PC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpx458ZAAADHklEQVQ4EXVSW0gUURj+zszs7OzsbrurrZUZVmiaFa2lRRbShSSDjG4kFUU9SHR5CIIieqq3XoKgiIJuL5EUQVEvQhczu0mlXVwvm1rpqrnbrrqzOzs7czozUA9WP8zA+f/v+/4r8B97Pkhzkho9ndDoiVffafZ/YH+7H/fQqYpGj6pfmjvH7x2jiQcnqdrX0j6epkcaw9Q/kUF+O1pZxiI/9pC+5jr9072C8eAjZLSMFbaJdjhL1kKYV9ORzi27HPyB62W5ZMQMWgJDKTrbF/10X2+5VjIWfAJNTYLqGqTClQA1kOpuBOFtECUnXEyIX7TrY0Qq3jDNR3o5U8UJbCAf6kuiHxqgCzKT5SAVrYFcugVyYDOkgkorV4YTEX13H3h7Y77LgSqTK5g/hx5fqAy0g3dNZqRt4N1TAF5gOjZQVqS8kIkUr4WhxKC8q4c6GIRDHQmYXO5cF7Xrsa8BNTYAPfYdxvgIHPOroXY/gzbUAS38GWrvK1bJJuijYYbpRzo+BP1nT2ldC7UJlV7kp/tDBZoSZ/XYIeYFEL15AK4VdRCy8lk7BNpwF6K3DkFeUAPl/R2kk6PM1z1nZ055njBdRjEXDbkNXQfn9LIvC+KMADjZB7XvDYggQvDmQcxdAM7lB2d3wUjGQSOhrDnzGNcnYYc+3AmO9e1cVAvO4QXvmQal9S4b5GrYZy2zsvK+PCbqYa1sZdgc8PFeTJWxWFB0NIiFq7bT0EuMPb+E9EAbHHOrWCY3Ei+ugtgcIJKbVWLH2NPzSHU9AcfaIjN3a6Mq3nKTbLgiBGovZC/ZDhga1J5mJvIRrop9IA4PCCvZXXkI6f5WiwxDh7d0I8Tyvac8EnnIdkXoyyA9XrHi8FzPj9CqWGcTm/A3jDVeZBP/Zg3R3E4m0geaUeEtWArb8oP1p4M4Y67xzymH4rRwZqqzIXZrf75GRFA2KD0RMTHWQHlnNmxGEq5NZ1vbpEB1mZ+EzdgfAfMRTtBq/2DT7XjTJdkwKGNah2qdM8+QzvKdkeHp69bP8JDXJv6fFk/RdQalw3SCMcHeiEIrJpJ+AbL5XZBdjHF2AAAAAElFTkSuQmCC`)
  appTray.setImage(icon)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
