module.exports = (io, streams) => {
    let rooms = [];

    io.on("connection", (client) => {
        console.log('-- ' + client.id + ' connected --');
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
        client.on("join-room", async (data) => {
            const roomID = await data.roomID;
            client.join(roomID);
            console.log('-- ' + client.id + ' joined room' + roomID + '--');
            io.to(roomID).emit("user-joined", data);
        });

        // Watcher left the room
        client.on("leave-room", async (data) => {
            const roomID = await data.roomID;
            console.log('-- ' + client.id + ' left room' + roomID + '--');
            io.to(roomID).emit("user-left", data);
        });

        // Message in room
        client.on("message-room", async (data) => {
            const roomID = await data.roomID;
            console.log('-- ' + client.id + ' messaged room' + roomID + '--');
            io.to(roomID).emit("new-message", data);
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

        client.on('send-data', async (data) => {
            const roomID = await data.roomID;
            io.to(roomID).emit("recieved-data", data);
        });

    });
}