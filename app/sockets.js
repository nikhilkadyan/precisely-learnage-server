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

        // When user disconnect or leave
        client.on('disconnect', leave);
        client.on('leave', leave);

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