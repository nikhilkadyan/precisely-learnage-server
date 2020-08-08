let express = require("express");
let socketIO = require("socket.io");
let http = require("http");

const DEFAULT_PORT = 3000;
const app = express();
const httpServer = http.createServer(app);

// Import Streams
let streams = require('./app/streams');

app.get('/', (req, res) => {
    res.send('Hello!')
});

httpServer.listen(DEFAULT_PORT, () => console.log(`Listening on port ${DEFAULT_PORT}`));

// Import Sockets
const io = socketIO(httpServer);
require('./app/sockets')(io, streams);