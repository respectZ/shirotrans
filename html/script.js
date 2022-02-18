// const { ipcRenderer } = require("electron/renderer");

let setting = {
    type: {
        select: 0,
        input: {
            number: 1,
            text: 2
        },
        checkbox: 3,
        json: 4
    }
}

let settingIDs = {
    general: {
        "setting-general-mode": setting.type.select,
        "setting-general-resolution-width": setting.type.input.number,
        "setting-general-resolution-height": setting.type.input.number,
        "setting-general-alwaysontop": setting.type.checkbox,
    },
    hotkeys: {
        "setting-hotkeys-setarea": setting.type.input.text,
        "setting-hotkeys-resetarea": setting.type.input.text,
        "setting-hotkeys-translate": setting.type.input.text,
    },
    text: {
        "setting-text-size": setting.type.input.number
    },
    translation: {
        "setting-translation-service": setting.type.select,
        "setting-translation-source": setting.type.select,
        "setting-translation-target": setting.type.select,
        "setting-translation-glosarium": setting.type.json
    }
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function updateContent(translation, furigana) {
    document.getElementById("jp").innerHTML = furigana;
    document.getElementById("tr").innerHTML = translation;
}

function recursiveJSON(json, arr) {
    if(arr.length == 1)
    return json[arr[0]]
    if(arr.length == 2)
    return json[arr[0]][arr[1]]
    if(arr.length == 3)
    return json[arr[0]][arr[1]][arr[2]]
}

function loadSetting(category) {
    let data = JSON.parse(httpGet("../setting.json"));
    for(var i in data) {
        setting[i] = data[i];
    }
    for(var j in settingIDs[category]) {
        let settingValue = recursiveJSON(data[category], j.split("-").slice(2));
        switch (settingIDs[category][j]) {
            case setting.type.select:
                document.getElementById(j).value = settingValue;
                break;
            case setting.type.input.number:
                document.getElementById(j).value = settingValue;
                break;
            case setting.type.input.text:
                document.getElementById(j).value = settingValue;
                break;
            case setting.type.checkbox:
                document.getElementById(j).checked = settingValue;
                break;
            case setting.type.json:
                document.getElementById(j).value = settingValue;
                break;
            default:
                value = null;
                console.log("unhandled " + settingIDs[category][j] + " " + j)
                break;
        }
    }
    // console.log(data)
}

function saveSetting(category) {
    console.log(category)
    for(var id in settingIDs[category]) {
        let value;
        switch (settingIDs[category][id]) {
            case setting.type.select:
                value = parseInt(document.getElementById(id).value);
                break;
            case setting.type.input.number:
                value = parseInt(document.getElementById(id).value);
                break;
            case setting.type.input.text:
                value = document.getElementById(id).value;
                break;
            case setting.type.checkbox:
                value = document.getElementById(id).checked;
                break;
            case setting.type.json:
                value = {}
                break;
            default:
                value = null;
                console.log("unhandled " + settingIDs[category])
                break;
        }
        let keys = id.split("-").slice(2);
        if(keys.length == 1)
        setting[category][keys[0]] = value;
        if(keys.length == 2)
        setting[category][keys[0]][keys[1]] = value;
        if(keys.length == 3)
        setting[category][keys[0]][keys[1]][keys[2]] = value;
    }
    applySetting()
    console.log(setting)
    require('electron').ipcRenderer.send('updatesetting', setting);
}

function applySetting() {
    document.getElementById("jp").style.fontSize = setting["text"]["size"] + "px";
    document.getElementById("tr").style.fontSize = setting["text"]["size"] + "px";
}

document.querySelector('#setting-category').addEventListener('click', e => {
    for(var i =0; i < document.getElementById("setting-category").children.length; i++) {
        document.getElementById("setting-category").children[i].children[0].classList.remove("setting-active")
        document.getElementById("setting-content").innerHTML = httpGet(`./pages/${e.target.innerHTML.toLowerCase()}.html`)

        loadSetting(e.target.innerHTML.toLowerCase())

        let element = document.querySelectorAll(".setting-item");
        console.log(element)
        for(var j = 0; j < element.length; j++) {
            element[j].addEventListener('change', ee => {
                saveSetting(e.target.innerHTML.toLowerCase());
            })
        }
    }
    e.target.classList.add("setting-active")
});

document.body.onload = (e) => {
    document.querySelector(".setting-active").click();
}