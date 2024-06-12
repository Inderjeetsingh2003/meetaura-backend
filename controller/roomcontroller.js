const Room=require('../schema/Roomschema')

const createroom=(async(req,res)=>
{
    const{title,description,accesstype,roomtype}=req.body
    console.log(req.body)

    try{

        let room=await Room.findOne({title})
            if(room)
                {
                    return res.status(400).json({success:0,message:"room with this title already exists"})
                }
                room=new Room({
                    title,description,accesstype,roomtype,admin:req.user.id
                })
        
                await room.save()
                return res.status(200).json({success:1,message:"room created successfully"})
    }
    catch(error){
        console.log("error is ",error.messgage)
        return res.status(500).json({success:0,message:"internal server error"})
    }
        
})

module.exports={createroom}