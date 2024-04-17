const express = require("express");
// const userModel = require("../models/usermodel");
const userController = require("../controller/userController");

const userRouter = express.Router();

userRouter.post("/sendotp", userController.sendOtp);
userRouter.post("/verifyotp", userController.verifyOtp);
userRouter.post("/verifyotplogin", userController.verifiedLoginOtp);

// Route for user registration
userRouter.post("/register", userController.NewUser);

// Route for user login
userRouter.post("/login", userController.loginUser);

module.exports = userRouter;