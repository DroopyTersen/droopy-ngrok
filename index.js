var cmdProcess = require("./cmdProcess");
var request = require("request-promise");
var qrcode = require('qrcode-terminal');
var ngrokApiUrl = "http://127.0.0.1:4040/api/tunnels";

var getTunnelUrl = function(done) {
    setTimeout(() => {
        console.log("Checking for NGROK url...");
        request({ url: ngrokApiUrl, json: true }).then(data => {
            if (data.tunnels && data.tunnels.length > 1) {
                done(data.tunnels[1].public_url);
            } else {
                getTunnelUrl(done);
            }
        }).catch(e => {
            getTunnelUrl(done);
        })
    }, 1000);
};

var generateQRCode = function(url) {
    if (url) {
        console.log(url);
        qrcode.generate(url, (qr) => console.log(qr));
    } else {
        console.log("QR Code Error: No url given");
    }
};

var start = function(port, cb) {
    var ngrokPath = __dirname + "\\node_modules\\ngrok\\bin\\ngrok.exe";
    var ngrokArgs = ["http", port];
    var ngrokProcess = cmdProcess.create(ngrokPath, ngrokArgs);
    
    getTunnelUrl(generateQRCode);
    
    return { 
        stop: () => ngrokProcess.kill() 
    };
};

start(3000);
module.exports = { start };