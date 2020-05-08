const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
var os = require('os');

const app = express();
const server = http.createServer(app);
const io = SocketIO.listen(server);

app.use(express.static(__dirname + '/public'));
server.listen(3000, () => console.log('server on port 3000'));

