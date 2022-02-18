const screenshot = require("screenshot-desktop")
const sharp = require("sharp")
const fs = require("fs")

sharp.cache(false);

const takeScreenshot = (x, y, width, height) => {
    return new Promise((resolve, reject) => {
        if(fs.existsSync("./temp/image.png")) {
            fs.unlinkSync("./temp/image.png")
        }
        screenshot({"filename": "./temp/image.png"}).then(() => {
            if(fs.existsSync("./temp/image_crop.png")) {
                fs.unlinkSync("./temp/image_crop.png")
            }
    
            sharp("./temp/image.png").extract({
                left: x,
                top: y,
                width: width,
                height: height
            }).toFile("./temp/image_crop.png", (err) => {
                if(err)
                    reject(err)
                else
                    resolve("./temp/image_crop.png")
            })
    
        })
    })
}

module.exports = {
    takeScreenshot: takeScreenshot
}