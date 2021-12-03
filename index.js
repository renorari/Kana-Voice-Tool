const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        "title": "Kana Voice",
        "width": screen.getPrimaryDisplay().size.width / 1.2,
        "height": screen.getPrimaryDisplay().size.height / 1.2,
        "icon": "",
        "backgroundColor": "#121212",
        "autoHideMenuBar": true,
        "webPreferences": {
            "preload": path.join(__dirname, "preload.js")
        }
    });

    mainWindow.setMenu(null);
    mainWindow.loadFile("index.html");

    mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
