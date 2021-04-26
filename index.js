const { app, BrowserWindow, ipcMain, Notification } = require("electron")

const { autoUpdater } = require('electron-updater')

const log = require("electron-log")

Object.assign(console, log.functions);


const windows = {}

app.on("ready", () => {

    windows.updater = new BrowserWindow({
        width: 310,
        height: 390,
        fullscreenable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    windows.updater.loadFile("./src/screens/updater/index.html")
    autoUpdater.checkForUpdatesAndNotify()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

ipcMain.on("get-app-version", event => {
    event.sender.send("app-version", { version: app.getVersion() })
})

autoUpdater.on("update-available", () => {
    ipcMain.emit("update-available")
})

autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall()
})

autoUpdater.on("update-not-available", () => {
    windows.main = new BrowserWindow({
        width: 800,
        height: 750,
        fullscreenable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    windows.main.setMenu(null)
    windows.main.loadFile("./src/screens/is_logged_in/index.html")
    windows.updater.close()
})

autoUpdater.on("error", err => {})

autoUpdater.on('download-progress', (progressObj) => {
    ipcMain.emit("update-progress", { percentage: `${progressObj.percent}%` })
})
