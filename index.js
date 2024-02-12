const express = require('express')
const mongoose = require('mongoose')
const userRoute = require('./routes/userRoute')
const app = express();
const server = require('http').Server(app);
const User = require('./models/userModel');

const io = require('socket.io')(server);

require('dotenv').config()

let port = process.env.PORT;

mongoose.connect('mongodb+srv://chat:chat@cluster0.2jiqn0s.mongodb.net/?retryWrites=true&w=majority')

app.use('/',userRoute);

let usp = io.of('/user-namespace')

usp.on('connection',async function(socket){
    
    const userId = socket.handshake.auth.token;
    // console.log(userId);
    await User.findByIdAndUpdate({ _id : userId}, {$set:{is_online:'1'}})
    
    socket.broadcast.emit('onlineUser',{user_id: userId})
    console.log("user Connected",userId);
    
    socket.on('disconnect',async function(){
        const userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate({ _id : userId}, {$set:{is_online:'0'}})
        socket.broadcast.emit('offlineUser',{user_id: userId});
        console.log("user disconnected",userId);
    })
})

server.listen(port,()=>{
    console.log("Server started...",process.env.PORT);
})