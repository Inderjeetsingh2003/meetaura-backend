
const { error } = require('console')
const mongoose=require('mongoose')

mongoose.connect('mongodb+srv://rahul6005:rahul2003@cluster0.pj579.mongodb.net/MeetAura').then((value)=>
{
    console.log("database is successfully connected")
}).catch((error)=>
{
    console.log(error.message)
    console.log('unable to connect with database')
})
