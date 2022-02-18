const fs = require("fs")
const robot = require("robotjs")

function initSetting() {
    if(fs.existsSync("./setting.json")) {
        return loadSetting()
    } else {
        setting = {
            general: {
                mode: 0,
                resolution: {
                    width: robot.getScreenSize().width,
                    height: robot.getScreenSize().height
                },
                alwaysontop: true
            },
            hotkeys: {
                setarea: "F2",
                resetarea: "F3",
                translate: "F4"
            },
            text: {
                size: 36
            },
            translation: {
                service: 0,
                source: 0,
                target: 0,
                glosarium: {}
            }
        }
        saveSetting(setting);
        return setting;
    }
}

function loadSetting() {
    return JSON.parse(fs.readFileSync("./setting.json", 'utf-8'));
}

function saveSetting(data) {
    fs.writeFileSync("./setting.json", JSON.stringify(data), 'utf-8', (err) => {
        if(err) return err;
        return 1;
    })
}

function updateSetting(category, key, value) {
    data = loadSetting();
    data[category][key] = value;
    saveSetting(data)
}

module.exports = {
    initSetting: initSetting,
    loadSetting: loadSetting,
    saveSetting: saveSetting,
    updateSetting: updateSetting
}