const { app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const fs = require("fs")
const path = require("path")
const robot = require("robotjs")
const { convertToFurigana } = require("./scripts/furigana")
const { ocr } = require("./scripts/ocr")
const { takeScreenshot } = require('./scripts/screenshot')
const { captureMouse } = require("./scripts/capturemouse")
const { initSetting, saveSetting} = require("./scripts/setting")

let setting;
let mouse1, mouse2;
let mainWindow, deepLWindow;
let text_furigana = "";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*=============== FUNCTION ===============*/

function initHotkeys() {
    globalShortcut.unregisterAll();

    globalShortcut.register(setting.hotkeys.setarea, () => {
        if(!mouse1) {
            mouse1 = captureMouse(setting.general.resolution)
        } else {
            mouse2 = captureMouse(setting.general.resolution)
        }
    })
    globalShortcut.register(setting.hotkeys.resetarea, () => {
        mouse1 = mouse2 = null;
    })
    globalShortcut.register(setting.hotkeys.translate, () => {
        switch (setting.general.mode) {
            //1 Window
            case 0:
                if(mouse1 && mouse2) {
                    let pos = {
                        x: Math.min(mouse1.x, mouse2.x),
                        y: Math.min(mouse1.y, mouse2.y)
                    }
        
                    takeScreenshot(pos.x, pos.y, Math.max(mouse1.x, mouse2.x) - pos.x, Math.max(mouse1.y, mouse2.y) - pos.y).then((img) => {
                        ocr(img).then((text) => {
                                convertToFurigana(text).then((_) => {
                                    text_furigana = _;
                                })
                            deepLWindow = new BrowserWindow({
                                width: 10,
                                height: 10,
                                webPreferences: {
                                    preload: path.join(__dirname, './scripts/preload/deepl.js'),
                                    backgroundThrottling: false
                                }
                            })
                            deepLWindow.loadURL("https://www.deepl.com/translator#ja/en/" + text)
                            deepLWindow.hide();
                        })
                    })
        
                }
                break;
            
            //Auto Behind Window
            case 1:
                let pos = {
                    x: Math.round(mainWindow.getPosition()[0] * 1.2),
                    y: Math.round(mainWindow.getPosition()[1] * 1.2)
                }

                let size = {
                    width:  Math.round(mainWindow.getSize()[0] * 1.2) > setting.general.resolution.width ? setting.general.resolution.width : Math.round(mainWindow.getSize()[0] * 1.2),
                    height: mainWindow.getSize()[1] > setting.general.resolution.height ? setting.general.resolution.height : mainWindow.getSize()[1]
                }
                if(size.width < 0)
                    size.width = 0
                if(size.height < 0)
                    size.height = 0

                mainWindow.hide();
                sleep(200).then(() => {
                    takeScreenshot(pos.x, pos.y, size.width, size.height).then((img) => {
                        ocr(img).then((text) => {
                            // line wrap
                            text = text.replace(/(?:\r\n|\r|\n)/g, '');
                            fs.writeFileSync("./temp/text.txt", encodeURI(text), {encoding: 'utf-8'})
                                convertToFurigana(text).then((_) => {
                                    text_furigana = _;
                                })
                            deepLWindow = new BrowserWindow({
                                width: 10,
                                height: 10,
                                webPreferences: {
                                    preload: path.join(__dirname, './scripts/preload/deepl.js'),
                                    backgroundThrottling: false,
                                },
                                show: false
                            })
                            deepLWindow.loadURL("https://www.deepl.com/translator#ja/en/" + encodeURI(text).replace("%0A", ""))
                        })
                    })
                })
                
                // })
                break;

            //Auto Popup Position
            case 2:
                break;
        
            default:
                console.log("unhandled setting general mode " + setting.general.mode)
                break;
        }
       
    })
}

function applySetting() {
    initHotkeys();
    mainWindow.setAlwaysOnTop(setting.general.alwaysontop);
    DIM = setting.general.resolution
}

/*=============== MAIN APP ===============*/

app.on('ready', () => {
    if(!(fs.existsSync("./temp")))
        fs.mkdirSync("./temp")
    
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "node-ocr",
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    mainWindow.loadFile(path.join(__dirname, "/html/index.html"));

    setting = initSetting();
    applySetting();

    mainWindow.hide();
    mainWindow.show();

    // actual pos = 1.2 from electron pos
    // actua;
    
})

app.on('window-all-closed', () => {
    if(process.platform != "darwin") {
        app.quit()
    }
})

/*=============== IPC RENDERER ===============*/

ipcMain.on("translate", (event, data) => {
    // console.log(data)
    fs.writeFileSync("./temp/translate.txt", data, {encoding: "utf-8"})
    mainWindow.webContents.executeJavaScript("updateContent(`" + data + "`, `" + text_furigana + "`);")
    deepLWindow.close();
    mainWindow.show();

})

ipcMain.on("updatesetting", (event, data) => {
    console.log(data)
    delete data["type"]
    setting = data;
    applySetting();
    saveSetting(setting);
    console.log(setting)
})

/*=============== END ===============*/