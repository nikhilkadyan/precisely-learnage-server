let express = require("express");
let socketIO = require("socket.io");
let http = require("http");
let bodyParser = require('body-parser')

const DEFAULT_PORT = 3000;
const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

let rooms = [];

io.on("connection" , (client) => {
    console.log("Socket Connected");
    
    client.on("create-room", (room) => {
        rooms.push(room);
        client.broadcast("update-rooms", rooms);
    });

    client.on("join-room", (user, room) => {
        client.join(room.id);
        client.to(room.id).emit("add-user", user);
    });

    client.on("leave-room", (user, room) => {
        client.to(room.id).emit("remove-user", user);
    });

    client.on("readyToStream" , (data, room) => {
        client.to(room.id).emit("stream-started", data);
    });

});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello!')
});

httpServer.listen(DEFAULT_PORT, () => console.log(`Listening on port ${DEFAULT_PORT}`));