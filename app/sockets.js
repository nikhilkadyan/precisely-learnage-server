module.exports = (io, streams) => {
    let rooms = [];

    io.on("connection", (client) => {
        console.log("Socket Connected");
        client.emit('id', client.id);

        // Broadcast started
        client.on("readyToStream", (options) => {
            console.log('-- ' + client.id + ' is ready to stream --');
            streams.addStream(client.id, options.name);
        });

        // Update Stream
        client.on('update', function (options) {
            streams.update(client.id, options.name);
        });

        // Leave user logic
        function leave() {
            console.log('-- ' + client.id + ' left --');
            streams.removeStream(client.id);
        };

        // When broadcaster disconnect or leave
        client.on('disconnect', leave);
        client.on('leave', leave);

        // Wacther join room
        client("join-room", function(data){
            client.join(data.roomID);
            client.to(data.roomID).emit("user-joined", data);
        });

        // Watcher left the room
        client.on("leave-room", function (data) {
            client.to(data.roomID).emit("user-left", data);
        });

        // Message in room
        client.on("message-room", function(data){
            client.to(data.roomID).emit("new-message", data);
        });

        // Send message to single
        client.on('message', function (details) {
            var otherClient = io.sockets.connected[details.to];
 
            if (!otherClient) {
                return;
            }
            delete details.to;
            details.from = client.id;
            otherClient.emit('message', details);
        });

    });
}