'use strict';

// Required Modules
var cp = require("child_process");
var app = require('http').createServer();
var io = require('socket.io')(app);

// Variables declaration
var childprocesses = [];
var connections = [];

var init = function() {
	// Socket.IO Server Setup
	app.listen(5000, function() {
		console.log('Socket.IO Server is running on port 5000 ...');
	});

	// When Socket.IO Client connects
	io.sockets.on('connection', function(socket) {
		// Save Client connection
		connections.push(socket);
		console.log('A new Client connected (Total : %s clients)', connections.length);

		// When Socker.IO Client sends a new command
		socket.on('command', function(data) {
			// We don't handle empty commands
			data = data.trim();
			if (data !== "") {
				var cmd = data.split(' ');// Split commands by whitespace
				var cmdText = cmd.splice(0, 1); // Get the master command
				var child = cp.spawn(cmdText[0].trim(), cmd); // The rest will act as arguments

				// Add this child process to the list
				childprocesses.push(child);

				//////////* Socket.IO Events *//////////
				child.on('error', function(err) { // When an error occurs
					let error = "Unknown or invalid command.";
					io.sockets.emit('error output', {output: error});
				});

				child.stdout.on('data', function (stdout){ // When STDOUT data is generated
					io.sockets.emit('standard output', {output: stdout});
				});

				child.stderr.on('data', function (stderr){ // When STDERR data is generated
					io.sockets.emit('standard output', {output: stderr});
				});

				child.on('close', function(code){ // When Child process exits
					let data = "Child process exited with status code : "+code;
					io.sockets.emit('standard output', {output: data});
				});
			}
		});

		// When Socket.IO Client sends Interruption command
		socket.on('interruption', function(data) {
			// Interrupt all running processes
			for(var i=0; i<childprocesses.length; i++) {
				childprocesses[i].kill('SIGINT');
			}
		});

		// When Socket.IO Client Disconnects
		socket.on('disconnect', function(data) {
			connections.splice(connections.indexOf(socket), 1);
			console.log('A Client disconnected (Remaining : %s clients)', connections.length);
		});
	});
}

exports.init = init;
