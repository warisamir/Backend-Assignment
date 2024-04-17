const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addProduct,viewProductById,viewAllProducts } = require('../controller/productController');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter function to accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 
  }
});

// Route to add a product
router.post('/add', upload.single('image'), addProduct);
// Route to view a product

router.get('/view',viewAllProducts)
router.get('/:productId', viewProductById)



module.exports = router;