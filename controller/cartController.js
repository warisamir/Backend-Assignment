const Cart = require("../models/cart");

const addToCart = async (req, res) => {
    console.log(req.body)
  const { id } = req.params;
  try {
    const alreadypresentproduct = await Cart.findOne({ userid: req.body.userID, productid: id });
    if (alreadypresentproduct) {
      return res.status(401).send({ "msg": "Product already in cart" });
    }
    console.log("REQUEST USERID===",req.body.userID)
    const newProduct = new Cart({ userid: req.body.userID, productid: id });
    await newProduct.save();
    return res.status(200).send({ "msg": "Product added to cart", newProduct });
  } catch (error) {
    return res.status(500).send({ "msg": error.message });
  }
};

const getCartProducts = async (req, res) => {
  try {
    const userallProducts = await Cart.find({ userid: req.body.userID }).populate("productid")
    return res.status(200).send(userallProducts);
  } catch (error) {
    return res.status(500).send({ "msg": error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findOneAndDelete({ userid: req.body.userID,productid:id });
    return res.status(200).send({ "msg": "Product removed from cart" });
  } catch (error) {
    return res.status(500).send({ "msg": error.message });
  }
};



const increaseCartItemQuantity = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.body.userID; // Assuming the user ID is available in the request body
      // console.log("USERID===",userId)
  
      // Find and update the cart item belonging to the specified user
      await Cart.findOneAndUpdate({  userid: userId,productid:id }, { $inc: { quantity: 1 } });
  
      return res.status(200).send({ "msg": "Quantity increased" });
    } catch (error) {
      return res.status(500).send({ "msg": error.message });
    }
  };
  



const decreaseCartItemQuantity = async (req, res) => {
    try {
      const { id } = req.params;
      const { userID } = req.body;
  
      // Find the cart item belonging to the specified user and product
      const cartItem = await Cart.findOne({ userid: userID, productid: id });
  
      if (!cartItem) {
        return res.status(404).send({ "msg": "Cart item not found" });
      }
  
      if (cartItem.quantity === 1) {
        return res.status(400).send({ "msg": "You cannot decrement further" });
      }
  
      // Decrease the quantity of the cart item
      await Cart.findOneAndUpdate({ userid: userID, productid: id }, { $inc: { quantity: -1 } });
  
      return res.status(200).send({ "msg": "Quantity decreased" });
    } catch (error) {
      return res.status(500).send({ "msg": error.message });
    }
  };
  

module.exports = { addToCart, getCartProducts, deleteCartItem, increaseCartItemQuantity, decreaseCartItemQuantity };
