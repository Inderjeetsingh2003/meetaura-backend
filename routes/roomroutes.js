const express=require('express')
const router=express.Router()
const{createroomchatroom,getrooms}=require('../controller/roomcontroller')
const fetchadmin=require('../middleware/useraccess')


router.route('/createroom').post(fetchadmin,createroomchatroom)
router.route('/getrooms').get(fetchadmin,getrooms)


module.exports=router