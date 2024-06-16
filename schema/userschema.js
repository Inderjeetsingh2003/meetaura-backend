const mongoose=require('mongoose')
const crypto=require('crypto')
const userschema=mongoose.Schema({
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
    },
    resetpasswordtoken:String,
    resetpasswordexpire:String  
})

userschema.methods.getResetToken=function()
{
    const resettoken= crypto.randomBytes(20).toString('hex');
    this.resetpasswordtoken=crypto.createHash('sha256').update(resettoken).digest('hex');
    this.resetpasswordexpire=Date.now()+15*60*1000 // 15 min
    return resettoken;
}

const User=mongoose.model('user',userschema)
module.exports=User;