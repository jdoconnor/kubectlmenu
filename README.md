# kubectlmenu
Electron App that works with the Mac menu bar to give quick access to kubectl commands

![](screenshot.png)

### How to Install

Download from the [releases](https://github.com/lumoslabs/kubectlmenu/releases) page.

---
# If you want to contribute
### How to Develop

First, install dependencies:

```
yarn install
```

Next, run with Electron:

```
npm run start
```

### How to Release

Run `node_modules/.bin/electron-builder build` to build the MacOS .dmg file.
