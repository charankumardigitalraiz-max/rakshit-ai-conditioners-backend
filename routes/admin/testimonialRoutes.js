const express = require('express');
const {
  getTestimonials,
  createTestimonial,
  deleteTestimonial
} = require('../../controller/admin/testimonialController');

const upload = require('../../middleware/upload');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getTestimonials)
  .post(protect, upload.single('image'), createTestimonial);

router
  .route('/:id')
  .delete(protect, deleteTestimonial);

module.exports = router;
