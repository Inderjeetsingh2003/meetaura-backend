const express=require('express')
const router=express.Router()
const{googlelogin,logindirectly,signup,getuserdetails,updateuser}=require('../controller/usercontroller')
const fetchadmin=require('../middleware/useraccess')
router.route('/googlelogin').post(googlelogin)

router.route('/login').post(logindirectly)
router.route('/signup').post(signup)
router.route('/getuserdetails').get(fetchadmin,getuserdetails)
router.route('/updateuser').patch(fetchadmin,updateuser)
module.exports=router