


const Product = require("../models/product");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category,rating } = req.body;
    const image = req.file.filename;

    // Create a new product
    const newProduct = new Product({ name, description, price, category, image,rating });
    await newProduct.save();

    return res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const viewProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const viewAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addProduct,viewProductById,viewAllProducts };