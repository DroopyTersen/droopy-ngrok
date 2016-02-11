#!/usr/bin/env node
var droopyNgrok = require("./index");

var program = require('commander');
 
program
  .version('0.0.1')
  .option('-p, --port <port>', 'The local port expose publicly')
  .option('-q, --qrcode', 'Output a QR Code link to the public url')
  .option('-s, --server', 'Create webserver serving static content from the current directory')
  .parse(process.argv);

var port = 3001;
var options = {};
if (program.port) port = program.port
if (program.server) options.server = true;
if (program.qrcode) options.qrcode = true;

console.log(port);
console.log(options);
droopyNgrok.start(port, options);