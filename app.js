var express = require('express')
, app = express()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server)
, users = {};


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',(socket)=>{
    
    socket.on('sendMessage',(data)=>{
        
        io.sockets.emit('new message',{msg:data,nick:socket.nickname});

    });

    socket.on('new user',(data,callback)=>{
        if (data in users) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
        }
    });
    function updateNicknames() {
        io.sockets.emit("usernames", Object.keys(users));
    }

    socket.on('disconnect',(data)=>{
        if(!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
    });
});


server.listen(8000);