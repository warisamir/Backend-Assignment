// models/user.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   fullname: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   gender: {
//     type: String,
//     enum: ["male", "female", "other"],
//     required: true
//   }
// });

// module.exports = mongoose.model("User", userSchema);

// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    // required: true
  },
  otpVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);
