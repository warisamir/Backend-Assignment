const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productid: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model("Cart", CartSchema);