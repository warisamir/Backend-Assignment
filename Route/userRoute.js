const express=require("express")
// const userModel=require("../models/usermodel")
const userController=require("../controller/userController")

const userrouter=express.Router();


userrouter.post("/sendotp",userController.sendOtp)
userrouter.post("/verifyotp",userController.verifyOtp)
userrouter.post("/verifyotplogin",userController.verifyOtplogin)



// Route for user registration
userrouter.post("/register", userController.registerUser);

// Route for user login
userrouter.post("/login", userController.loginUser);







module.exports=userrouter