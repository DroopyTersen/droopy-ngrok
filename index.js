var ngrok = require('ngrok');
var qrcode = require('qrcode-terminal');
var liveServer = require("live-server");
var open = require("open");
var path = require("path");

var startLiveServer = function(port, opts) {
    var params = { port, open:false };
    if (opts.path) params.root = opts.path;
    liveServer.start(params);
};

var startNgrok = function(port) {
    return new Promise((resolve, reject) => {
        ngrok.connect(port, function (err, url) {
            if (err) reject(err)
            resolve(url);
        });
    })
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

    return startNgrok(port).then(url => {
        console.log(`        
PUBLIC URL
============
${url}
============
        `);
        if (opts.qrcode) generateQRCode(url);
        if (opts.open) open(url);
        return url
    });
};

var stop = function() {
    liveServer.shutdown();
    ngrok.kill();
};

module.exports = { start, stop };