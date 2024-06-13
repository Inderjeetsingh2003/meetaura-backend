const express=require('express')
const router=express.Router()
const{createroom,getpublicroom}=require('../controller/roomcontroller')
const fetchadmin=require('../middleware/useraccess')


router.route('/createroom').post(fetchadmin,createroom)
router.route('/getallpublicrooms').get(fetchadmin,getpublicroom)

module.exports=router