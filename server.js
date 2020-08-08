let express = require("express");
let socketIO = require("socket.io");

const app = express();

// Import Streams
let streams = require('./app/streams');

app.get('/', (req, res) => {
    res.send('Hello!')
});

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), () => console.log('Listening on port ' + app.get('port')));

// Import Sockets
const io = socketIO(server);
require('./app/sockets')(io, streams);