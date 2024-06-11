const express=require('express');
const path = require('path');
const app=express()
const cors=require('cors')
app.use(cors())
app.use(express.json())

require("dotenv").config()
require('./dbcon/dbconnect')
const PORT=4000;

app.use('/user',require(path.join(__dirname,'./routes/user.js')))
app.use('/room',require(path.join(__dirname,'./routes/roomroutes.js')))
app.listen(PORT,()=>
{
    console.log(`app is listening at port:${PORT}`)
})