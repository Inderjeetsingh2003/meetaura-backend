const express=require('express')
const router=express.Router()
const{googlelogin,logindirectly,signup}=require('../controller/usercontroller')
router.route('/googlelogin').post(googlelogin)

router.route('/login').post(logindirectly)
router.route('/signup').post(signup)

module.exports=router