const express = require('express');
const {
  getContacts,
  createContact,
  updateContactStatus,
  deleteContact,
} = require('../../controller/admin/messages/contactController');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');

router.route('/')
  .get(protect, authorize('admin', 'super-admin'), getContacts)
  .post(createContact); // Public creation

router.route('/:id')
  .put(protect, authorize('admin', 'super-admin'), updateContactStatus)
  .delete(protect, authorize('admin', 'super-admin'), deleteContact);

module.exports = router;
