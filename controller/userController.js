const twilio=require("twilio")
const otpgen=require("otp-generator")
require("dotenv").config()
const ac_sid=process.env.TWILIO_AC_SID
const auth_token=process.env.TWILIO_AUTH_TOKEN
const phoneNum=process.env.TWILIO_PHONE_NO
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const twilioclient=new twilio(ac_sid,auth_token)


const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const otp = otpgen.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    await twilioclient.messages.create({
      body: `Your OTP is ${otp}`,
      to: phoneNumber,
      from: phoneNum
    });

    await User.findOneAndUpdate(
            {phoneNumber},
            {otp},
            {upsert:true},
            {new:true}
            
        )

    return res.status(200).json({
      status: true,
      message: `OTP sent to ${phoneNumber}`
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, enteredOtp } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found with this phone number"
      });
    }

    if (user.otp !== enteredOtp) {
      return res.status(400).json({
        status: false,
        message: "Entered OTP is incorrect"
      });
    }

    // Update user's otpVerified status
    await User.updateOne({ phoneNumber }, { otpVerified: true });

    return res.status(200).json({
      status: true,
      message: "OTP verification successfully done"
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};




const verifyOtplogin = async (req, res) => {
  try {
    const { phoneNumber, enteredOtp } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found with this phone number"
      });
    }

    if (user.otp !== enteredOtp) {
      return res.status(400).json({
        status: false,
        message: "Entered OTP is incorrect"
      });
    }

    // Update user's otpVerified status
    await User.updateOne({ phoneNumber }, { otpVerified: true });
    const token = jwt.sign({ userId: user._id }, process.env.tokenpass, { expiresIn: "6h" });

    return res.status(200).json({
      status: true,
      message: "OTP verification successfully done",
      token:token
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};



const registerUser = async (req, res) => {
  try {
    const { fullname, email, gender, phoneNumber } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if the phone number is verified
    const user = await User.findOne({ phoneNumber });
    if (!user || !user.otpVerified) {
      return res.status(400).json({ message: "Phone number not verified" });
    }

    // Update existing user if found, otherwise create new user
    const updatedUser = await User.findOneAndUpdate(
      { phoneNumber },
      { fullname, email, gender },
      { new: true, upsert: true }
    );

    return res.status(201).json({ message: "User registered successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};





// const loginUser = async (req, res) => {
//   try {
//     const { phoneNumber } = req.body;
//     const user = await User.findOne({ phoneNumber });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Send OTP
//     const otp = otpgen.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
//     user.otp = otp;
//     await user.save();

   

//     // Send OTP to user's phone number (you can use your twilio code here)

//     await twilioclient.messages.create({
//       body: `Your OTP is ${otp}`,
//       to: phoneNumber,
//       from: phoneNum
//     });

//     return res.status(200).json({ message: "OTP sent to user's phone number", otp });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };


const loginUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send OTP
    const otp = otpgen.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    user.otp = otp;
    await user.save();

    // Send OTP to user's phone number (you can use your twilio code here)
    await twilioclient.messages.create({
      body: `Your OTP is ${otp}`,
      to: phoneNumber,
      from: phoneNum
    });
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.tokenpass, { expiresIn: "6h" });

    return res.status(200).json({ message: "OTP sent to user's phone number", token, userDetails: user ,token:token});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports={sendOtp,verifyOtp,registerUser,loginUser,verifyOtplogin}