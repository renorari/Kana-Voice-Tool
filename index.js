const { app, BrowserWindow, screen, Menu } = require("electron");
const path = require("path");
const openAboutWindow = require("about-window").default;

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        "title": "Kana Voice Tool",
        "width": screen.getPrimaryDisplay().size.width / 1.2,
        "height": screen.getPrimaryDisplay().size.height / 1.2,
        "minWidth": 360,
        "minHeight": 480,
        "icon": "icon.png",
        "backgroundColor": "#121212",
        "autoHideMenuBar": true,
        "webPreferences": {
            //"preload": path.join(__dirname, "preload.js")
        }
    });

    mainWindow.setMenu(Menu.buildFromTemplate([
        {
            label: 'About Kana Voice Tool',
            click: () =>
                openAboutWindow({
                    icon_path: path.join(__dirname, "icon.png"),
                    product_name: "Kana Voice Tool",
                    bug_report_url: "https://github.com/TarochanChannel/Kana-Voice-Tool/issues",
                    bug_link_text: "バグ報告",
                    copyright: "(c) 2021 れのらり",
                    homepage: "https://github.com/TarochanChannel/Kana-Voice-Tool#readme",
                    description: "Kanaの音声合成ツールです。\n利用を開始する前に、必ず利用規約をお読みください。\nhttps://kana.renorari.net/api/voice_license.md\n\n本ソフトウエアにはwavesurfer.jsが含まれています。\nwavesurfer.js by katspaugh is licensed under a BSD-3-Clause License.",
                    license: "Apache-2.0",
                    win_options: {
                        parent: mainWindow,
                        modal: true
                    }
                }),
        }
    ]));
    mainWindow.loadFile("app/index.html");

    //mainWindow.webContents.openDevTools();
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
