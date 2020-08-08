module.exports = () => {
    var streamList = [];

    var Stream = function (id, name, roomID) {
        this.id = id;
        this.name = name;
        this.roomID = roomID;
    }

    return {
        addStream : function (id, name, roomID){
            currRoomStream = streamList.filter(s => s.roomID === roomID);
            if(!currRoomStream){
                var stream = new Stream(id, name, roomID);
                streamList.push(stream);
            } else {
                streamList = streamList.filter(s => s.roomID === roomID)
            }

        },
        removeStream: function (roomID){
            currRoomStream = streamList.filter(s => s.roomID === roomID);
            if(currRoomStream){
                streamList = streamList.filter(s => s.roomID === roomID)
            }
        },
        updateStream: function (roomID, name){
            stream = streamList.finc(s => s.roomID === roomID);
            stream.name = name;
        },
        getStreams: function (){
            return streamList;
        }
    }
}