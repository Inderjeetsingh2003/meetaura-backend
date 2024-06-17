const express=require('express')
const router=express.Router()
const{createroomchatroom,getpublicroom}=require('../controller/roomcontroller')
const fetchadmin=require('../middleware/useraccess')


router.route('/createroom').post(fetchadmin,createroomchatroom)
router.route('/getallpublicrooms').get(fetchadmin,getpublicroom)
router.route('/createprivatechatroom').post()
module.exports=router