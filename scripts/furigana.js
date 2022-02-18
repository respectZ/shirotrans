const Kuroshiro = require('kuroshiro');
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const kuroshiro = new Kuroshiro();

const convertToFurigana = (text) => {
    return new Promise((resolve, reject) => {
        kuroshiro.convert(text, {to: "hiragana", mode: "furigana"}).then((res) => {
            resolve(res)
        });
    })
}

(async function() {
    await kuroshiro.init(new KuromojiAnalyzer())
})();

module.exports = {
    convertToFurigana: convertToFurigana
};


