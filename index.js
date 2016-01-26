var droopyCmd = require('../droopy-cmd');
var http = new (require('droopy-http'))();
var qrcode = require('qrcode-terminal');

var getTunnelUrl = function() {
    var ngrokApiUrl = "http://localhost:4040/api/tunnels";
    return http.getJSON(ngrokApiUrl).then(
        (data) => {
            if (data.tunnels && data.tunnels.length > 1) {
                return data.tunnels[1].public_url;
            } else {
                //throw "Unable to find any active NGROK tunnels."
                return null;
            }
        }
        ,
        (error) => console.log(error)
    );   
}
var start = function(port) {
    var ngrokPath = __dirname + "\\node_modules\\ngrok\\bin\\ngrok.exe";
    var ngrokArgs = ["http", port];
    var ngrokProcess = droopyCmd.create(ngrokPath, ngrokArgs);
    
    // Give it a bit to spin up
    setTimeout(function() {
        getTunnelUrl().then(url => {
            if (url) {
                console.log(url);
                qrcode.generate(url, (qr) => console.log(qr));
            } else {
                console.log("Couldn't find ngrok tunnels");
            }
        });
    }, 6000);
    
    
    return { 
        stop: () => ngrokProcess.kill() 
    };
};

start(3000);
module.exports = { start };