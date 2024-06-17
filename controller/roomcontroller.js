
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
const getpublicroom=(async(req,res)=>
{
    try{
        const rooms= await Room.find({accesstype:"public"}).populate('admin','username')
        if(!rooms)
            {
                return res.status(404).json({success:0,message:"no public room present"})

            }
            return res.status(200).json({success:1,rooms});

    }catch(error)
    {
        console.log(error.message)
        return res.status(500).json({success:0,message:"internal server error"})
    }
})



module.exports={createroomchatroom,getpublicroom}