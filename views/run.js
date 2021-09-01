var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = (process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
server.listen(port, () => console.log('Server running in port ' + port));

io.on('connection', function (socket) {
    console.log('IO Connect: ' + socket.id);
    socket.use(async (packet, next) => {
        console.log(packet);
        let topic = packet[0];
        let data = packet[1];

        io.sockets.emit(topic, data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
