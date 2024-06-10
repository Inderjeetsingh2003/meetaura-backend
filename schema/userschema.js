const mongoose=require('mongoose')
const { type } = require('os')
const userscema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
        
    },
    photourl:{
        type:String,
        default:'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg'
    }
    
    
})

const User=mongoose.model('user',userscema)
module.exports=User;