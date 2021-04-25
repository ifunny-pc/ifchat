const { app, BrowserWindow, ipcMain, Notification } = require("electron")
const { autoUpdater } = require('electron-updater')

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

    new Notification({
        body: "Test notification"
    }).show()
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
    new Notification({
        body: "an update is available to your app, it will start downloading"
    }).show()
})



autoUpdater.on("update-downloaded", () => {
    new Notification({
        body: "an update has been downloaded to your app, it will now close and install."
    }).show()

    autoUpdater.quitAndInstall()
})

autoUpdater.on("update-not-available", () => {
    new Notification({
        body: "App is up to date!!"
    }).show()
})

autoUpdater.on("error", err => {
    new Notification({
        body: err.message
    }).show()
})

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    new Notification({
        body: log_message
    }).show()
})
