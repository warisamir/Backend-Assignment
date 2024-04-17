const mongoose= require("mongoose");
const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female","other"],
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    otp:
    {
        type:String,
        // required:true
    },
    otpverified:{
        type:Boolean,
        default:false
    }
});

module.exports=mongoose.model("User",userSchema);