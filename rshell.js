'use strict';

// Required Modules
var cp = require("child_process");
var app = require('http').createServer();
var io = require('socket.io')(app);

// Variables declaration
var childProcesses = [];
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
		socket.on('new_command', function(command) {
			// We don't handle empty commands
			command = command.trim();

			if (command !== "") {
				var cmd = command.split(' ');// Split commands by whitespace
				var cmdText = cmd.splice(0, 1); // Get the master command
				var child = cp.spawn(cmdText[0].trim(), cmd); // The rest will act as arguments

				// Add this child process to the list
				childProcesses.push(child);

				// Check If the spawned Command was launched
				if(!child.connected) {
					io.sockets.emit('process_started');
				}

				// Listening to Child Process events
				child.on('error', function(err) { 
					// When Child Process is unable to spawn the requested command
					let error = "Unknown or invalid command.";
					io.sockets.emit('process_failed', {output: err});
				});

				child.on('disconnect', function() {
					// When Child Process has been detached from its parent 
					// process (i.e. Node server process).
					io.sockets.emit('process_detached');
				});

				child.on('exit', function(code, signal) {
					// When Child Process finishes and exits
					io.sockets.emit('process_exited', {output: {code: code, signal: signal}});
				});

				// Listening to Child Process STDOUT events
				child.stdout.on('data', function (data){
					// When there's some ongoing data
					io.sockets.emit('process_running', {output: data});
				});

				child.stdout.on('error', function (err) { 
					// When an Error occurs
					io.sockets.emit('process_stdout_error', {output: err});
				});

				child.stdout.on('close', function () {
					// When Stream has been closed
					io.sockets.emit('process_stdout_closed');
				});

				child.stdout.on('end', function () { 
					// When there's no more ongoing data
					io.sockets.emit('process_stdout_ended');
				});

				// Listening to Child Process STDERR events
				child.stderr.on('data', function (data) {
					// When there is some ongoing data
					io.sockets.emit('process_running', {output: data});
				});

				child.stderr.on('error', function (err) {
					// When an Error occurs
					io.sockets.emit('process_stderr_error', {output: err});
				});

				child.stderr.on('close', function () { 
					// When Stream has been closed
					io.sockets.emit('process_stderr_closed');
				});

				child.stderr.on('end', function () { 
					// When no more ongoing data
					io.sockets.emit('process_stderr_ended');
				});

			}
		});

		// When Socket.IO Client sends Interruption command
		socket.on('interrupt_command', function() {
			// Interrupt all running processes
			for(var i=0; i<childProcesses.length; i++) {
				childProcesses[i].kill('SIGINT');
			}
		});

		// When Socket.IO Client sends Kill command
		socket.on('kill_command', function() {
			// Kill all running processes
			for(var i=0; i<childProcesses.length; i++) {
				childProcesses[i].kill('SIGKILL');
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
