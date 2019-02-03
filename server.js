var express = require('express');
var socket = require('socket.io');
var config = require('./config');
// App setup
var app = express();

var server = app.listen(1234, function () {
    console.log('listening for requests on port 1234');
});

// Static files
app.use(express.static('public'));


app.use((req, res, next) => {
    const error = new Error('404 Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
    next();
});

var connectionsLimit = config.connectionsLimit;
// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    if (io.engine.clientsCount > connectionsLimit) {
        socket.emit('err', { message: 'reach the limit of connections' })
        socket.disconnect()
        console.log('Disconnected...')
        return
      }

    const block = config.block;

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('chat', function (data) {

        var clientIp = socket.conn.remoteAddress;

        if(block.indexOf(clientIp) !== -1 ) {
            io.sockets.emit('chat', data);
        }
    });

    // Handle typing event
    socket.on('typing', function (data) {

        var clientIp = socket.conn.remoteAddress;

        if (block.indexOf(clientIp) !== -1 ) {
            socket.broadcast.emit('typing', data);
        }
    });

});
