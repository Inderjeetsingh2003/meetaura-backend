const express=require('express')
const router=express.Router()
const{googlelogin,logindirectly,signup,getuserdetails,updateuser,forgotpassword,resetpassword}=require('../controller/usercontroller')
const fetchadmin=require('../middleware/useraccess')
router.route('/googlelogin').post(googlelogin)

router.route('/login').post(logindirectly)
router.route('/signup').post(signup)
router.route('/getuserdetails').get(fetchadmin,getuserdetails)
router.route('/updateuser').patch(fetchadmin,updateuser)
router.route('/forgotpassword').post(forgotpassword)
router.route('/resetpassword/:token').put(resetpassword)
module.exports=router