// Required Modules
var express = require("express");
var app = express();
var rshell = require("../rshell");

// HTTP Server Setup
var listener = app.listen(3000, function(){
    console.log('Listening on port ' + listener.address().port); 
});

// Serving Home Page (index.html)
app.get('/', function(req, res) {
	res.sendFile(__dirname + "/index.html");
})

rshell.init();
