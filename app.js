var express = require('express')
, app = express()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server)
, nickNames = [];


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',(socket)=>{
    
    socket.on('sendMessage',(data)=>{
        
        io.sockets.emit('new message',{msg:data,nick:socket.nickname});
    });

    socket.on('new user',(data,callback)=>{
        if (nickNames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nickNames.push(socket.nickname);
            updateNicknames();
        }
    });
    function updateNicknames() {
        io.sockets.emit("usernames", nickNames);
    }

    socket.on('disconnect',(data)=>{
        if(!socket.nickname) return;
        nickNames.splice(nickNames.indexOf(socket.nickname),1);
        updateNicknames();
    });
});


server.listen(8000);