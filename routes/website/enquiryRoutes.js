const express = require('express');
const {
  createEnquiry,
} = require('../../controller/website/messages/enquiryController');

const router = express.Router();

// const { protect, authorize } = require('../../middleware/auth');

router.route('/')
  .post(createEnquiry); // Public creation
// .post(createEnquiry); // Public creation

// router.route('/:id')
//   .put(protect, authorize('admin', 'super-admin'), updateEnquiryStatus)
//   .delete(protect, authorize('admin', 'super-admin'), deleteEnquiry);

module.exports = router;
