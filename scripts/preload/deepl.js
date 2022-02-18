
window.addEventListener('DOMContentLoaded', () => {
    let text;
    let worker = setInterval(() => {
        text = document.getElementById("target-dummydiv").innerHTML;
        if(text != "" && text != " " && text != null && text != undefined && text != "\r\n") {
            require('electron').ipcRenderer.send('translate', text);
        }
    }, 500)
  })