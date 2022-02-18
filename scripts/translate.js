const request = require('request');
const uuid = require('uuid');

const translate = (text) => {
    return new Promise((resolve, reject) => {
        let JSON_deepL = {
            "jsonrpc":"2.0",
            "method":"LMT_handle_jobs",
            "params":{
                "jobs":[
                    {
                        "kind":"default",
                        "sentences":[
                            {
                                "text":text,
                                "id":0,
                                "prefix":""
                            }
                        ],
                        "raw_en_context_before":[
                            
                        ],
                        "raw_en_context_after":[
                            
                        ],
                        "preferred_num_beams":4,
                        "quality":"fast"
                    }
                ],
                "lang":{
                    "preference":{
                        "weight":{
                            "DE":0.18566,
                            "EN":0.4,
                            "ES":0.09657,
                            "FR":0.13952,
                            "IT":0.02701,
                            "JA":1.03786,
                            "NL":0.02651,
                            "PL":0.01376,
                            "PT":0.01421,
                            "RU":0.01584,
                            "ZH":0.02671
                        },
                        "default":"default"
                    },
                    "source_lang_user_selected":"auto",
                    "target_lang":"EN"
                },
                "priority":-1,
                "commonJobParams":{
                    "regionalVariant":"en-US",
                    "browserType":1,
                    "formality":null
                },
                "timestamp":1644790932333
            },
            "id":14500009
        }
        let options = {
            uri: 'https://apius.reqbin.com/api/v1/requests',
            method: 'POST',
            json: {
                id: 0,
                name: '',
                errors: '',
                json: JSON.stringify(
                    {
                        "method":"POST",
                        "url":"https://www2.deepl.com/jsonrpc?method=LMT_handle_jobs",
                        "apiNode":"DE",
                        "contentType":"JSON",
                        "content":JSON.stringify(JSON_deepL),
                        "headers":"",
                        "errors":"",
                        "curlCmd":"",
                        "codeCmd":"",
                        "lang":"",
                        "auth":{
                            "auth":"noAuth",
                            "bearerToken":"",
                            "basicUsername":"",
                            "basicPassword":"",
                            "customHeader":"",
                            "encrypted":""
                        },
                        "compare":false,
                        "idnUrl":"https://www2.deepl.com/jsonrpc?method=LMT_handle_jobs"
                    }
                ),
                deviceId: uuid.v4() + "R",
                sessionId: Math.floor(new Date().getTime() / 1000)
            }
        }
    
        request(options, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                let content = JSON.parse(body["Content"])
                // let result = content["result"]["translations"][0]["beams"][0]["sentences"][0]["text"];
                resolve(content)
            } else {
                reject(err)
            }
        })
    })
}

module.exports = {
    translate: translate
}
