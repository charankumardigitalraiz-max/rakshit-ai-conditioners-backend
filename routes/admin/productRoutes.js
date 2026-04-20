const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../../controller/admin/products/productController');

const upload = require('../../middleware/upload');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, upload.any(), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, upload.any(), updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
