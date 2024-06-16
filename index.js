const express=require('express');
const path = require('path');
const {createServer} =require('node:http')
const{Server}=require('socket.io')
const app=express()
const cors=require('cors');
const { METHODS } = require('http');

app.use(cors())
app.use(express.json())

require("dotenv").config()
const server=createServer(app)
const io= new Server(server,{
    cors:{
        origin:'*',
        METHODS:['POST','GET'],
        credentials:true
    }
})
require('./dbcon/dbconnect')
const PORT=4000;

io.on('connection',(socket)=>
{
    console.log(`${socket.id} is connected`)
    socket.on('setusername',(data)=>
    {
        const{roomid,username}=data
        socket.join(roomid)
        socket.broadcast.to(roomid).emit('userconnected',`${username} has joined the room`)
    })
    
    socket.on('sendmessage',(data)=>
    {
        const{message,roomid,username}=data;
        console.log("the socket sending mesage is:",username)
        io.to(roomid).emit('message',{message,username})

    })

  
})



app.use('/user',require(path.join(__dirname,'./routes/user.js')))
app.use('/room',require(path.join(__dirname,'./routes/roomroutes.js')))



server.listen(PORT,()=>
{
    console.log(`server is listening at port:${PORT}`)
})