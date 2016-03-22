var cmdProcess = require("./cmdProcess");
var request = require("request-promise");
var qrcode = require('qrcode-terminal');
var ngrokApiUrl = "http://127.0.0.1:4040/api/tunnels";
var liveServer = require("live-server");
var open = require("open");
var path = require("path");

var getTunnelUrl = function(done) {
    setTimeout(() => {
        request({
            url: ngrokApiUrl,
            json: true
        }).then(data => {
            if (data.tunnels && data.tunnels.length > 1) {
                console.log("HERE1");
                done(data.tunnels[1].public_url);
            } else {
                console.log("HERE2");
                getTunnelUrl(done);
            }
        }).catch(e => {
            console.log(e);
            getTunnelUrl(done);
        })
    }, 1000);
};

var startLiveServer = function(port, opts) {
    var params = { port, open:false };
    if (opts.path) params.root = opts.path;
    console.log(opts);
    liveServer.start(params);
};

var startNgrok = function(port, done) {
    var ngrokPath = process.cwd() + "\\node_modules\\ngrok\\bin\\ngrok.exe";
    // var ngrokPath = path.parse(__dirname).dir + "\\node_modules\\ngrok\\bin\\ngrok.exe";
    var ngrokArgs = ["http", port];
    var ngrokProcess = cmdProcess.create(ngrokPath, ngrokArgs);
    getTunnelUrl(done);
    return ngrokProcess;
};

var generateQRCode = function(url) {
    if (url) {
        qrcode.generate(url, (qr) => console.log(qr));
    } else {
        console.log("QR Code Error: No url given");
    }
};

var start = function(port, opts, done) {
    if (opts.server) startLiveServer(port, opts);
    var ngrokProcess = startNgrok(port, (url) => {
        console.log(url);
        if (opts.qrcode) generateQRCode(url);
        if (opts.open !== false) open(url);
        
        done(url);
    })

    return {
        stop: () => {
            ngrokProcess.kill();
            liveServer.shutdown();
        }
    };
};

module.exports = {
    start
};