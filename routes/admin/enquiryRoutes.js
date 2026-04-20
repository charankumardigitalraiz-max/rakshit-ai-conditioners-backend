const express = require('express');
const {
  getEnquiries,
  createEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
} = require('../../controller/admin/messages/enquiryController');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');

router.route('/')
  .get(protect, authorize('admin', 'super-admin'), getEnquiries)
  .post(createEnquiry); // Public creation

router.route('/:id')
  .put(protect, authorize('admin', 'super-admin'), updateEnquiryStatus)
  .delete(protect, authorize('admin', 'super-admin'), deleteEnquiry);

module.exports = router;
