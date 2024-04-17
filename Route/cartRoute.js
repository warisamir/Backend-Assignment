const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");

router.post("/add/:id", cartController.addToCart);
router.get("/get", cartController.getCartProducts);
router.delete("/del/:id", cartController.deleteCartItem);
router.patch("/inc/:id", cartController.increaseCartItemQuantity);
router.patch("/dec/:id", cartController.decreaseCartItemQuantity);

module.exports = router;