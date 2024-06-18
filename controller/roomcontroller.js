
const { default: mongoose } = require('mongoose')
const Room=require('../schema/Roomschema')

const createroomchatroom=(async(req,res)=>
{
    const{title,description,accesstype,roomtype,joincode}=req.body
    console.log(req.body)

    try{

        let room=await Room.findOne({title})
            if(room)
                {
                    return res.status(400).json({success:0,message:"room with this title already exists"})
                }

                let newroom={
                    title,
                    description, 
                    accesstype,
                    roomtype,
                    admin:req.user.id,

                }
                if(joincode)
                    {
                        newroom.joincode=joincode
                    }
                room=new Room(newroom)
        
                await room.save()
                return res.status(200).json({success:1,message:"room created successfully"})
    }
    catch(error){
        console.log("error is ",error.messgage)
        return res.status(500).json({success:0,message:"internal server error"})
    }
        
})


// get all public rooms
const getrooms=(async(req,res)=>
{
    try{
        const userid= new mongoose.Types.ObjectId(req.user.id)
       let privaterooms=await Room.find({accesstype:'private',$or:[{admin:userid},{members:userid}]}).populate('admin','username')
       let PublicRooms= await Room.find({accesstype:'public'}).populate('admin','username')
       let rooms= privaterooms.concat(PublicRooms)
        if(!rooms||rooms.length===0)
            {
                    return res.status(404).json({success:0,message:"no room to display"})
            }
            return res.status(200).json({success:1,rooms})


    }catch(error)
    {
        console.log(error.message)
        return res.status(500).json({success:0,message:"internal server error"})
    }
})





module.exports={createroomchatroom,getrooms}