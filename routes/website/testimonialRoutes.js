const express = require('express');
const {
  getTestimonials,
  // createTestimonial,
  // updateTestimonial,
  // deleteTestimonial
} = require('../../controller/website/testimonials/testimonialsController');

const router = express.Router();


router
  .route('/')
  .get(getTestimonials)
// .post(protect, upload.single('image'), createProject);

module.exports = router;
