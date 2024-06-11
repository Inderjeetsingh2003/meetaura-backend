const express=require('express')
const router=express.Router()
const{createroom}=require('../controller/roomcontroller')
const fetchadmin=require('../middleware/useraccess')


router.route('/createroom').post(fetchadmin,createroom)



module.exports=router