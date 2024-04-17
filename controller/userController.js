const jwt=require("jsonwebtoken")
const User=require("../models/user");
const twilio=require("twilio")
const otpgen=require("otp-generator")
require("dotenv").config();
const twilioclient = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
const sendOtp=async(req,res)=>{
    try {
        const {phoneNumber}=req.body;
        const user=await User.findOne({$or:[{phoneNumber}]});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const otp=otpgen.generate(4,{lowerCaseAlphabets:false,upperCaseAlphabets:false, specialChars:false});
        user.otp=otp;
         await twilioclient.message.create({
             body:`Your otp is ${otp}`,
             to:phoneNumber,
             from:process.env.TWILIO_NUMBER
         });
         await User.findOneAndUpdate({phoneNumber},{$set:{otp}});
         return res.status(200).json({status:true,message:`Otp sent  successfully to ${phoneNumber}`})
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}


const verifyOtp=async(req,res)=>{
    try {
        const {phoneNumber,otp}=req.body;
        const user=await User.findOne({$or:[{phoneNumber}]});
        if(!user){
            return res.status(404).json({
                status:false,
                message:"User not found with this phone number"})
        }
        if(user.otp!==otp){
            return res.status(400).json({status:false,message:"Invalid otp"})
        }
await User.findOneAndUpdate({phoneNumber},{otpVerified:true});
return res.status(200).json({status:true,message:"otp verified successfully"})
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}

const verifiedLoginOtp=async(req,res)=>{
    try {
        const {phoneNumber,otp}=req.body;
        const user=await User.findOne({$or:[{phoneNumber}]});
        if(!user){
            return res.status(404).json({
                status:false,
                message:"User not found with this phone number"})
        }
        if(user.otp!==otp){
            return res.status(400).json({status:false,message:"Invalid otp"});
        }
        await User.findOneAndUpdate({phoneNumber},{$set:{otpVerified:true}});
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        return res.status(200).json({message:"Otp verified successfully",token,userDetails: user ,token:token});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}
const loginUser=async(req,res)=>{
    try{
        const {phoneNumber}=req.body;
        const user=await User.findOne({$or:[{phoneNumber}]});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const otp=otpgen.generate(4,{lowerCaseAlphabets:false,upperCaseAlphabets:false, specialChars:false});
        user.otp=otp;
        await user.save();
        await twilioclient.message.create({
            body:`Your otp is ${otp}`,
            to:phoneNumber,
            from:process.env.TWILIO_NUMBER
        });
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        return res.status(200).json({message:"Otp sent successfully",token,userDetails: user ,token:token});
}
catch(err){
    return res.status(500).json({message:err.message})
}
}
const NewUser=async(req,res)=>{
    try{
    const {fullname,email,gender,phoneNumber}=req.body;
    const exitinguser=await User.findOne({email});
    if(exitinguser){
        return res.status(400).json({message:"Email already exists"})
    }
   
        const user=await User.findOne({phoneNumber});
        if(!user|| !user.otpVerified){
            return res.status(400).json({message:"Phone Number not found"})
        }
        const updateUserinfo=await User.findOneAndUpdate({phoneNumber},
            {fullname,email,gender},{new:true,upsert:true}
        )
        return res.status(201).json({message:"User created successfully",user:updatedUser});
}
catch(err){
return res.status(500).json({message:err.message})
}
}

module.exports ={sendOtp,verifyOtp,verifiedLoginOtp,loginUser,NewUser}