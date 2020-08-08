module.exports = (io, streams) => {
    let rooms = [];

    io.on("connection", (client) => {
        console.log("Socket Connected");

        client.on("create-room", (room) => {
            rooms.push(room);
            client.broadcast("update-rooms", rooms);
        });

        client.on("join", (user, room) => {
            client.join(room.id);
            client.to(room.id).emit("add-user", user);
        });

        client.on("leave", (user, room) => {
            let currStream = streams.getStreams.filter(s => s.roomID = room.id);
            if(currStream.id === client.id){
                client.to(room.id).emit("stream-ended", null);
            }
            client.to(room.id).emit("remove-user", user);
        });

        client.on("readyToStream", (data, room) => {
            streams.addStream(client.id, data.name, room.id);
            client.to(room.id).emit("stream-started", data);
        });

    });
}