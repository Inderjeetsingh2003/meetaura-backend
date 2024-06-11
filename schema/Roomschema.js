
const mongoose=require('mongoose')
const memberschema=mongoose.Schema({
    id:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    email:{
        type:String
    }
})
const roomschema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    accesstype:{
        type:String,
        required:true,
        enum:['public','private']
    },
    roomtype:
    {
        type:String,
        required:true,
        enum:['chat','audio/video']
    },
    members:[memberschema],
    admin:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    }
})

const Room=mongoose.model('Room',roomschema)
module.exports= Room;