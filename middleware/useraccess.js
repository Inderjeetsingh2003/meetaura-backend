const express=require('express')
const jwt=require("jsonwebtoken")

const fetchadmin=(req,res,next)=>
{
    

        const token=req.header('access-token')
        // console.log(token)
        if(!token)
        {
            return res.status(401).send("invalid token")
        }
        try{

            const data=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
            req.user=data.user
            console.log(req.user.id)
            next()
        }

    catch(error)
    {
        console.log(error.message)
        return res.status(401).send("token is not valid")
    }

}
module.exports=fetchadmin;