const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addProduct, viewProductById, viewAllProducts } = require('../controller/productController');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
    const fileExtension = file.originalname.split('.').pop(); // Get the file extension
    cb(null, `${uniqueSuffix}.${fileExtension}`); // Combine unique name and extension
  }
});

// File filter function to accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('File type not supported'), false); // Reject the file
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
  }
});

// Route to add a product with file upload
router.post('/add', upload.single('image'), addProduct);

// Route to view all products
router.get('/view', viewAllProducts);

// Route to view a specific product by ID
router.get('/:productId', viewProductById);

module.exports = router;
