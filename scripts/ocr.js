const request = require("request")
const fs = require("fs")

url = "https://content-vision.googleapis.com/v1/images:annotate?alt=json&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM"

dataJSON = {
    "requests": [
        {
            "features": [
                {
                    "type": "TEXT_DETECTION"
                }
            ],
            "image": {
                "content": ""
            }
        }
    ]
}

header = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98.0.1108.43\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-clientdetails": "appVersion=5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F98.0.4758.80%20Safari%2F537.36&platform=Win32&userAgent=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F98.0.4758.80%20Safari%2F537.36",
    "x-goog-encode-response-if-executable": "base64",
    "x-javascript-user-agent": "apix/3.0.0 google-api-javascript-client/1.1.0",
    "x-origin": "https://explorer.apis.google.com",
    "x-referer": "https://explorer.apis.google.com",
    "x-requested-with": "XMLHttpRequest",
    "Referer": "https://content-vision.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en.TenOR_lLL28.O%2Fam%3DAQ%2Fd%3D1%2Frs%3DAGLTcCMCcuroc7gdKSyRrVMzYC23sHf_SA%2Fm%3D__features__",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}

function base64_encode(file) {
    return fs.readFileSync(file, 'base64');
}


const ocr = (file) => {
    return new Promise((resolve, reject) => {
        img = base64_encode(file)
        dataJSON["requests"][0]["image"]["content"] = img
        request.post({
            uri: url,
            method: 'POST',
            json: dataJSON,
            headers: header
        }, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                resolve(body["responses"][0]["fullTextAnnotation"]["text"])
            } else {
                reject(error)
            }
        })
    })
}


module.exports = {
    ocr: ocr
}

// ocr("./temp/image_crop.png").then((text) => {
//     console.log(text)
// })